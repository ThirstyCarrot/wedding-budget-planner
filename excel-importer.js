/**
 * @file excel-importer.js
 * @description Intelligent client-side Excel (.xlsx, .xls) and CSV (.csv) expense importer
 * for EternalPlan Wedding Budget Tracker.
 * 
 * Features:
 * - 100% private, client-side spreadsheet parsing (via SheetJS with built-in CSV fallback).
 * - Multi-sheet detection and selection.
 * - Heuristic header & column mapping for names, categories, estimates, booked costs, vendors, due dates, and notes.
 * - Intelligent wedding category inference from category titles or expense descriptions.
 * - Interactive Confirmation Dashboard allowing couples to review, edit, complete missing information,
 *   bulk-assign categories/dates, and filter items before committing to their budget.
 * - Seamless integration with EternalPlan state, payment schedule milestone generation, and cloud sync.
 */

(function() {
  'use strict';

  // Default wedding budget categories fallback
  const CATEGORIES = (typeof window !== 'undefined' && window.DEFAULT_CATEGORIES) ? window.DEFAULT_CATEGORIES : [
    { id: 'venue-catering', name: 'Venue & Catering', icon: '🏰', color: '#B38A58' },
    { id: 'photo-video', name: 'Photography & Video', icon: '📸', color: '#916A7E' },
    { id: 'attire-beauty', name: 'Attire, Rings & Beauty', icon: '👗', color: '#68827A' },
    { id: 'floral-decor', name: 'Floral & Decor', icon: '💐', color: '#889868' },
    { id: 'entertainment', name: 'Music & Entertainment', icon: '🎷', color: '#A06B52' },
    { id: 'stationery', name: 'Stationery & Invites', icon: '💌', color: '#768599' },
    { id: 'cake-dessert', name: 'Cake & Desserts', icon: '🎂', color: '#B57E70' },
    { id: 'officiant-legal', name: 'Officiant & Legal', icon: '📜', color: '#7C748C' },
    { id: 'favors-transport', name: 'Transport & Favors', icon: '🚗', color: '#647D8A' },
    { id: 'contingency', name: 'Honeymoon & Cushion', icon: '✈️', color: '#A3805B' }
  ];

  // Category keyword patterns for intelligent auto-tagging
  const CATEGORY_KEYWORDS = {
    'venue-catering': [
      'venue', 'catering', 'caterer', 'banquet', 'dinner', 'food', 'hall', 'reception', 'bar',
      'cocktail', 'beverage', 'alcohol', 'wine', 'beer', 'ballroom', 'rehearsal dinner', 'site fee',
      'corkage', 'bartender', 'kitchen', 'estate', 'winery', 'restaurant', 'meal', 'buffet', 'plated'
    ],
    'photo-video': [
      'photo', 'photographer', 'photography', 'video', 'videographer', 'videography', 'album',
      'portraits', 'camera', 'drone', 'footage', 'film', 'prints', 'engagement shoot', 'second shooter'
    ],
    'attire-beauty': [
      'attire', 'dress', 'gown', 'tux', 'suit', 'tuxedo', 'hair', 'makeup', 'beauty', 'ring',
      'rings', 'wedding band', 'bands', 'jewelry', 'veil', 'shoes', 'alterations', 'bridal', 'groom',
      'bridesmaid', 'groomsman', 'salon', 'manicure', 'cufflinks', 'tie', 'boutique', 'lingerie', 'accessories'
    ],
    'floral-decor': [
      'floral', 'flower', 'flowers', 'florist', 'bouquet', 'bouquets', 'boutonniere', 'centerpiece',
      'centerpieces', 'decor', 'decoration', 'garland', 'arbor', 'arch', 'lighting', 'candle', 'candles',
      'linens', 'chair cover', 'drapery', 'backdrop', 'rentals', 'vases', 'petals', 'installations'
    ],
    'entertainment': [
      'entertainment', 'music', 'dj', 'band', 'musician', 'musicians', 'quartet', 'singer',
      'mc', 'emcee', 'sound', 'audio', 'speakers', 'playlist', 'acoustic', 'live music', 'harpist', 'sax'
    ],
    'stationery': [
      'stationery', 'invitation', 'invitations', 'invite', 'invites', 'save the date', 'save the dates',
      'rsvp', 'postage', 'stamp', 'stamps', 'calligraphy', 'program', 'programs', 'menu card', 'menus',
      'signage', 'escort card', 'place cards', 'thank you', 'cards', 'envelopes'
    ],
    'cake-dessert': [
      'cake', 'dessert', 'desserts', 'bakery', 'baker', 'cupcake', 'cupcakes', 'pastry',
      'pastries', 'donut', 'donuts', 'sweet', 'sweets', 'cake cutting', 'groom\'s cake', 'tasting'
    ],
    'officiant-legal': [
      'officiant', 'legal', 'license', 'marriage license', 'pastor', 'priest', 'rabbi',
      'celebrant', 'notary', 'courthouse', 'minister', 'certificate', 'fees'
    ],
    'favors-transport': [
      'transport', 'transportation', 'favor', 'favors', 'limousine', 'limo', 'bus', 'shuttle',
      'valet', 'carriage', 'trolley', 'gift bag', 'gift bags', 'welcome bag', 'welcome bags',
      'guest favors', 'send-off', 'sparklers'
    ],
    'contingency': [
      'honeymoon', 'flight', 'flights', 'hotel', 'resort', 'airfare', 'cushion', 'emergency',
      'buffer', 'tips', 'gratuity', 'contingency', 'miscellaneous', 'misc', 'unexpected', 'passport'
    ]
  };

  // Importer Internal State
  let importState = {
    workbook: null,
    fileName: '',
    fileSizeStr: '',
    sheetNames: [],
    activeSheetName: '',
    rawRows: [],
    headerRowIndex: 0,
    headers: [],
    columnMappings: {
      name: -1,
      category: -1,
      estimatedCost: -1,
      actualCost: -1,
      dueDate: -1,
      vendor: -1,
      notes: -1
    },
    items: [], // Parsed and editable row items
    activeFilter: 'all' // 'all' | 'attention' | 'ready'
  };

  // DOM Elements Cache
  let DOM = {};

  function initDomElements() {
    DOM = {
      modal: document.getElementById('excelImportModal'),
      closeBtn: document.getElementById('closeExcelModalBtn'),
      cancelBtn: document.getElementById('cancelExcelModalBtn'),
      openHeaderBtn: document.getElementById('openExcelImportBtn'),
      openBudgetBtn: document.getElementById('importExcelBudgetBtn'),
      openDataModalBtn: document.getElementById('openExcelFromDataModalBtn'),

      // Views
      uploadView: document.getElementById('excelUploadView'),
      dashboardView: document.getElementById('excelDashboardView'),
      dropzone: document.getElementById('excelDropzone'),
      fileInput: document.getElementById('excelFileInput'),
      downloadTemplateBtn: document.getElementById('downloadExcelTemplateBtn'),
      downloadTemplateBottomBtn: document.getElementById('downloadExcelTemplateBottomBtn'),

      // Dashboard Header & File Info
      fileName: document.getElementById('excelFileName'),
      fileSize: document.getElementById('excelFileSize'),
      sheetSelectorWrapper: document.getElementById('excelSheetSelectorWrapper'),
      sheetSelect: document.getElementById('excelSheetSelect'),
      reuploadBtn: document.getElementById('excelReuploadBtn'),

      // KPIs
      statTotal: document.getElementById('excelStatTotal'),
      statReady: document.getElementById('excelStatReady'),
      statNeedsAttention: document.getElementById('excelStatNeedsAttention'),
      statSum: document.getElementById('excelStatSum'),

      // Column Mapping
      mappingDetails: document.getElementById('excelMappingDetails'),
      mappingSummaryText: document.getElementById('excelMappingSummaryText'),
      mapNameCol: document.getElementById('mapNameCol'),
      mapCategoryCol: document.getElementById('mapCategoryCol'),
      mapEstCostCol: document.getElementById('mapEstCostCol'),
      mapActCostCol: document.getElementById('mapActCostCol'),
      mapDueDateCol: document.getElementById('mapDueDateCol'),
      mapVendorCol: document.getElementById('mapVendorCol'),
      mapNotesCol: document.getElementById('mapNotesCol'),

      // Filters & Bulk Tools
      filterAllBtn: document.getElementById('filterAllBtn'),
      filterAttentionBtn: document.getElementById('filterAttentionBtn'),
      filterReadyBtn: document.getElementById('filterReadyBtn'),
      filterAllCount: document.getElementById('filterAllCount'),
      filterAttentionCount: document.getElementById('filterAttentionCount'),
      filterReadyCount: document.getElementById('filterReadyCount'),
      bulkCategorySelect: document.getElementById('bulkCategorySelect'),
      applyBulkCategoryBtn: document.getElementById('applyBulkCategoryBtn'),
      bulkDueDateInput: document.getElementById('bulkDueDateInput'),
      applyBulkDueDateBtn: document.getElementById('applyBulkDueDateBtn'),
      applyWeddingDateBulkBtn: document.getElementById('applyWeddingDateBulkBtn'),
      selectAllBtn: document.getElementById('selectAllRowsBtn'),
      deselectAllBtn: document.getElementById('deselectAllRowsBtn'),
      masterCheckbox: document.getElementById('masterRowCheckbox'),

      // Table & Actions
      tableBody: document.getElementById('excelTableBody'),
      addNewRowBtn: document.getElementById('addNewExcelRowBtn'),
      confirmBtn: document.getElementById('confirmExcelImportBtn'),
      confirmCount: document.getElementById('confirmImportCount')
    };
  }

  // =========================================================================
  // MODAL CONTROLS & OPEN/CLOSE
  // =========================================================================

  function openModal() {
    if (!DOM.modal) return;
    DOM.modal.showModal();
    if (importState.items.length === 0) {
      showUploadView();
    } else {
      showDashboardView();
    }
  }

  function closeModal() {
    if (DOM.modal && DOM.modal.open) {
      DOM.modal.close();
    }
  }

  function showUploadView() {
    if (DOM.uploadView) DOM.uploadView.style.display = 'block';
    if (DOM.dashboardView) DOM.dashboardView.style.display = 'none';
    if (DOM.confirmBtn) DOM.confirmBtn.style.display = 'none';
  }

  function showDashboardView() {
    if (DOM.uploadView) DOM.uploadView.style.display = 'none';
    if (DOM.dashboardView) DOM.dashboardView.style.display = 'block';
    if (DOM.confirmBtn) DOM.confirmBtn.style.display = 'inline-flex';
  }

  function resetImportState() {
    importState = {
      workbook: null,
      fileName: '',
      fileSizeStr: '',
      sheetNames: [],
      activeSheetName: '',
      rawRows: [],
      headerRowIndex: 0,
      headers: [],
      columnMappings: {
        name: -1,
        category: -1,
        estimatedCost: -1,
        actualCost: -1,
        dueDate: -1,
        vendor: -1,
        notes: -1
      },
      items: [],
      activeFilter: 'all'
    };
    if (DOM.fileInput) DOM.fileInput.value = '';
    showUploadView();
  }

  // =========================================================================
  // FILE READING & PARSING (SHEETJS + CSV FALLBACK)
  // =========================================================================

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function handleFileSelected(file) {
    if (!file) return;

    importState.fileName = file.name;
    importState.fileSizeStr = formatBytes(file.size);

    const ext = file.name.split('.').pop().toLowerCase();

    // Check if SheetJS XLSX is available
    if (typeof window.XLSX !== 'undefined') {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = window.XLSX.read(data, { type: 'array', cellDates: true });
          processWorkbook(workbook);
        } catch (err) {
          console.error('Failed to parse workbook via SheetJS:', err);
          alert('Could not parse this spreadsheet file: ' + (err.message || 'Unknown format'));
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (ext === 'csv') {
      // Fallback CSV text parser if SheetJS is offline or unavailable
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const text = e.target.result;
          const rows = parseCsvText(text);
          processRawRows(rows, ['Sheet1'], 'Sheet1');
        } catch (err) {
          console.error('Failed to parse CSV:', err);
          alert('Failed to parse CSV file: ' + err.message);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Spreadsheet library is currently loading or offline. Please upload a .csv file or check your internet connection.');
    }
  }

  /**
   * Robust RFC-4180 CSV parser handling quotes, linebreaks, and escaped commas.
   */
  function parseCsvText(text) {
    const lines = [];
    let row = [''];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];

      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') {
          i++; // Skip CRLF
        }
        lines.push(row);
        row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== '') {
      lines.push(row);
    }
    return lines;
  }

  function processWorkbook(workbook) {
    importState.workbook = workbook;
    importState.sheetNames = workbook.SheetNames || [];
    if (importState.sheetNames.length === 0) {
      alert('The spreadsheet contains no sheets.');
      return;
    }

    // Smart default sheet selection: prefer a sheet with keywords like "budget", "expense", "cost", "vendor"
    let targetSheet = importState.sheetNames[0];
    const budgetKeywordSheet = importState.sheetNames.find(s => /budget|expense|cost|vendor|wedding/i.test(s));
    if (budgetKeywordSheet) {
      targetSheet = budgetKeywordSheet;
    }

    loadSheet(targetSheet);
  }

  function loadSheet(sheetName) {
    importState.activeSheetName = sheetName;
    const worksheet = importState.workbook.Sheets[sheetName];
    // Convert worksheet to 2D array of raw values with defval empty string
    const rows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', blankrows: false });
    processRawRows(rows, importState.sheetNames, sheetName);
  }

  // =========================================================================
  // HEURISTIC HEADER & COLUMN DETECTION
  // =========================================================================

  function processRawRows(rows, sheetNames, activeSheet) {
    importState.rawRows = rows;
    importState.sheetNames = sheetNames;
    importState.activeSheetName = activeSheet;

    if (!rows || rows.length === 0) {
      alert('The selected sheet is completely empty.');
      return;
    }

    // Step 1: Detect header row (scan first 10 rows for highest score)
    const headerDetect = detectHeaderRow(rows);
    importState.headerRowIndex = headerDetect.rowIndex;
    importState.headers = headerDetect.headers;

    // Step 2: Auto-detect column mappings
    importState.columnMappings = detectColumnMappings(importState.headers);

    // Step 3: Parse data rows into initial items list
    parseItemsFromRows();

    // Step 4: Populate UI controls and switch to Confirmation Dashboard
    populateSheetSelector();
    populateMappingSelects();
    populateBulkCategorySelect();
    renderDashboard();
    showDashboardView();
  }

  /**
   * Scans rows to find the one that most likely represents the column headers.
   */
  function detectHeaderRow(rows) {
    let bestRowIdx = 0;
    let maxScore = -1;
    const scanLimit = Math.min(rows.length, 12);

    const keywords = [
      'item', 'name', 'expense', 'description', 'service', 'category', 'type',
      'cost', 'price', 'estimate', 'estimated', 'actual', 'budget', 'planned',
      'vendor', 'company', 'date', 'due', 'notes', 'comments', 'status', 'deposit'
    ];

    for (let r = 0; r < scanLimit; r++) {
      const row = rows[r];
      if (!Array.isArray(row) || row.length === 0) continue;

      let score = 0;
      row.forEach(cell => {
        const str = String(cell || '').trim().toLowerCase();
        if (!str) return;
        keywords.forEach(kw => {
          if (str.includes(kw)) score += 2;
        });
      });

      if (score > maxScore) {
        maxScore = score;
        bestRowIdx = r;
      }
    }

    const headerRow = rows[bestRowIdx] || [];
    // Ensure all headers have readable text
    const headers = headerRow.map((h, i) => {
      const clean = String(h || '').trim();
      return clean || `Column ${String.fromCharCode(65 + i)}`;
    });

    return { rowIndex: bestRowIdx, headers };
  }

  /**
   * Maps column indices based on header names.
   */
  function detectColumnMappings(headers) {
    const mappings = {
      name: -1,
      category: -1,
      estimatedCost: -1,
      actualCost: -1,
      dueDate: -1,
      vendor: -1,
      notes: -1
    };

    const costIndices = [];

    headers.forEach((h, idx) => {
      const str = String(h).trim().toLowerCase();

      // Item Name
      if (mappings.name === -1 && /(item|expense|description|service|title|activity|name)/i.test(str) && !/vendor|category/i.test(str)) {
        mappings.name = idx;
      }

      // Category
      if (mappings.category === -1 && /(category|type|section|group|bucket|dept|department)/i.test(str)) {
        mappings.category = idx;
      }

      // Vendor
      if (mappings.vendor === -1 && /(vendor|company|provider|contractor|supplier|contact|who|person)/i.test(str)) {
        mappings.vendor = idx;
      }

      // Due Date
      if (mappings.dueDate === -1 && /(due|date|deadline|payment date|when|schedule)/i.test(str)) {
        mappings.dueDate = idx;
      }

      // Notes
      if (mappings.notes === -1 && /(note|notes|comment|comments|scope|detail|remarks|memo)/i.test(str)) {
        mappings.notes = idx;
      }

      // Estimated Cost
      if (mappings.estimatedCost === -1 && /(estimated|estimate|budget|budgeted|planned|projected|quote|target)/i.test(str)) {
        mappings.estimatedCost = idx;
      }

      // Actual Cost
      if (mappings.actualCost === -1 && /(actual|booked|final|agreed|contract|paid|spent|invoice)/i.test(str)) {
        mappings.actualCost = idx;
      }

      // Track any generic cost/price columns
      if (/(cost|price|amount|total|\$)/i.test(str)) {
        costIndices.push(idx);
      }
    });

    // If estimatedCost or actualCost wasn't specifically found, use generic cost columns
    if (mappings.estimatedCost === -1 && costIndices.length > 0) {
      mappings.estimatedCost = costIndices[0];
    }
    if (mappings.actualCost === -1) {
      if (costIndices.length > 1) {
        mappings.actualCost = costIndices[1];
      } else if (mappings.estimatedCost !== -1) {
        mappings.actualCost = mappings.estimatedCost;
      }
    }

    // Fallback: If item name is still unmapped, pick first non-empty text column
    if (mappings.name === -1 && headers.length > 0) {
      for (let i = 0; i < headers.length; i++) {
        if (i !== mappings.category && i !== mappings.estimatedCost && i !== mappings.actualCost) {
          mappings.name = i;
          break;
        }
      }
    }

    return mappings;
  }

  // =========================================================================
  // VALUE PARSING & SANITIZATION HELPERS
  // =========================================================================

  function parseCurrencyValue(val) {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : Math.round(val);

    const cleaned = String(val).replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.round(num);
  }

  function parseDateValue(val) {
    if (!val) return '';

    // If already JS Date object from SheetJS
    if (val instanceof Date && !isNaN(val.getTime())) {
      return val.toISOString().split('T')[0];
    }

    // If Excel serial number (e.g. 45123)
    if (typeof val === 'number' && val > 20000 && val < 60000) {
      try {
        const utcDays = Math.floor(val - 25569);
        const utcValue = utcDays * 86400;
        const dateInfo = new Date(utcValue * 1000);
        return dateInfo.toISOString().split('T')[0];
      } catch (e) {}
    }

    const str = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return str;
    }

    // Try standard Date parse
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }

    return '';
  }

  /**
   * Intelligently resolves category ID from category text or item name.
   */
  function resolveCategory(catText, itemName) {
    const rawCat = String(catText || '').trim().toLowerCase();
    const rawName = String(itemName || '').trim().toLowerCase();

    // 1. Direct match with DEFAULT_CATEGORIES
    if (rawCat) {
      for (const cat of CATEGORIES) {
        if (cat.id.toLowerCase() === rawCat || cat.name.toLowerCase() === rawCat) {
          return cat.id;
        }
      }

      // 2. Keyword match on category text
      for (const [catId, words] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const w of words) {
          if (rawCat.includes(w)) {
            return catId;
          }
        }
      }
    }

    // 3. Fallback: Keyword match on Item Name
    if (rawName) {
      for (const [catId, words] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const w of words) {
          if (rawName.includes(w)) {
            return catId;
          }
        }
      }
    }

    return null;
  }

  // =========================================================================
  // PARSING ROWS INTO ITEMS
  // =========================================================================

  function parseItemsFromRows() {
    const items = [];
    const maps = importState.columnMappings;
    const startIdx = importState.headerRowIndex + 1;

    for (let r = startIdx; r < importState.rawRows.length; r++) {
      const row = importState.rawRows[r];
      if (!Array.isArray(row) || row.length === 0) continue;

      // Extract raw cell values
      const rawName = maps.name >= 0 ? row[maps.name] : '';
      const rawCat = maps.category >= 0 ? row[maps.category] : '';
      const rawEst = maps.estimatedCost >= 0 ? row[maps.estimatedCost] : '';
      const rawAct = maps.actualCost >= 0 ? row[maps.actualCost] : '';
      const rawDate = maps.dueDate >= 0 ? row[maps.dueDate] : '';
      const rawVendor = maps.vendor >= 0 ? row[maps.vendor] : '';
      const rawNotes = maps.notes >= 0 ? row[maps.notes] : '';

      const name = String(rawName || '').trim();
      const vendor = String(rawVendor || '').trim();
      const notes = String(rawNotes || '').trim();
      const estCost = parseCurrencyValue(rawEst);
      const actCost = parseCurrencyValue(rawAct);
      const dueDate = parseDateValue(rawDate);
      const categoryId = resolveCategory(rawCat, name);

      // Skip row if it has no name and zero cost (likely empty spacing row)
      if (!name && estCost === 0 && actCost === 0) {
        continue;
      }

      // Skip summary / total rows
      if (/^(total|subtotal|grand total|sum|balance due)\b/i.test(name)) {
        continue;
      }

      const item = {
        id: 'imp-item-' + r + '-' + Date.now(),
        rowIndex: r,
        included: true,
        name: name,
        vendor: vendor,
        notes: notes,
        estimatedCost: estCost,
        actualCost: actCost > 0 ? actCost : estCost,
        dueDate: dueDate,
        categoryId: categoryId,
        rawCategoryText: String(rawCat || '').trim()
      };

      evaluateItemStatus(item);
      items.push(item);
    }

    importState.items = items;
  }

  /**
   * Checks whether the item is ready or missing required fields.
   */
  function evaluateItemStatus(item) {
    const issues = [];

    if (!item.name || item.name.trim() === '') {
      issues.push('Missing Name');
    }
    if ((item.estimatedCost <= 0) && (item.actualCost <= 0)) {
      issues.push('Missing Cost');
    }
    if (!item.categoryId) {
      issues.push('Uncategorized');
    }

    item.missingIssues = issues;
    item.isReady = (issues.length === 0);
  }

  // =========================================================================
  // CONFIRMATION DASHBOARD UI POPULATION & RENDERING
  // =========================================================================

  function populateSheetSelector() {
    if (!DOM.sheetSelect || !DOM.sheetSelectorWrapper) return;

    if (importState.sheetNames.length > 1) {
      DOM.sheetSelectorWrapper.style.display = 'flex';
      DOM.sheetSelect.innerHTML = importState.sheetNames.map(s => {
        const isSel = s === importState.activeSheetName ? 'selected' : '';
        return `<option value="${escapeHtml(s)}" ${isSel}>${escapeHtml(s)}</option>`;
      }).join('');
    } else {
      DOM.sheetSelectorWrapper.style.display = 'none';
    }

    if (DOM.fileName) DOM.fileName.textContent = importState.fileName;
    if (DOM.fileSize) DOM.fileSize.textContent = importState.fileSizeStr;
  }

  function populateMappingSelects() {
    const selects = [
      DOM.mapNameCol, DOM.mapCategoryCol, DOM.mapEstCostCol,
      DOM.mapActCostCol, DOM.mapDueDateCol, DOM.mapVendorCol, DOM.mapNotesCol
    ];

    const optionsHtml = [
      '<option value="-1">-- Not in Spreadsheet --</option>',
      ...importState.headers.map((h, i) => `<option value="${i}">${escapeHtml(h)} (Col ${String.fromCharCode(65 + i)})</option>`)
    ].join('');

    selects.forEach(sel => {
      if (sel) sel.innerHTML = optionsHtml;
    });

    const m = importState.columnMappings;
    if (DOM.mapNameCol) DOM.mapNameCol.value = m.name;
    if (DOM.mapCategoryCol) DOM.mapCategoryCol.value = m.category;
    if (DOM.mapEstCostCol) DOM.mapEstCostCol.value = m.estimatedCost;
    if (DOM.mapActCostCol) DOM.mapActCostCol.value = m.actualCost;
    if (DOM.mapDueDateCol) DOM.mapDueDateCol.value = m.dueDate;
    if (DOM.mapVendorCol) DOM.mapVendorCol.value = m.vendor;
    if (DOM.mapNotesCol) DOM.mapNotesCol.value = m.notes;

    updateMappingSummaryText();
  }

  function updateMappingSummaryText() {
    if (!DOM.mappingSummaryText) return;
    const m = importState.columnMappings;
    const parts = [];

    if (m.name >= 0) parts.push(`Name: ${importState.headers[m.name]}`);
    if (m.category >= 0) parts.push(`Category: ${importState.headers[m.category]}`);
    if (m.estimatedCost >= 0) parts.push(`Cost: ${importState.headers[m.estimatedCost]}`);
    if (m.dueDate >= 0) parts.push(`Due Date: ${importState.headers[m.dueDate]}`);

    DOM.mappingSummaryText.textContent = parts.length > 0 ? parts.join(' • ') : 'Auto-detected';
  }

  function populateBulkCategorySelect() {
    if (!DOM.bulkCategorySelect) return;
    DOM.bulkCategorySelect.innerHTML = CATEGORIES.map(cat => {
      return `<option value="${cat.id}">${cat.icon} ${escapeHtml(cat.name)}</option>`;
    }).join('');
  }

  /**
   * Re-renders the interactive Confirmation Dashboard table and updates KPI ribbons.
   */
  function renderDashboard() {
    updateKpis();
    renderTableRows();
  }

  function updateKpis() {
    const total = importState.items.length;
    let readyCount = 0;
    let attentionCount = 0;
    let selectedSum = 0;
    let selectedCount = 0;

    importState.items.forEach(item => {
      evaluateItemStatus(item);
      if (item.isReady) readyCount++;
      else attentionCount++;

      if (item.included) {
        selectedCount++;
        const cost = item.actualCost > 0 ? item.actualCost : item.estimatedCost;
        selectedSum += (cost > 0 ? cost : 0);
      }
    });

    if (DOM.statTotal) DOM.statTotal.textContent = total;
    if (DOM.statReady) DOM.statReady.textContent = readyCount;
    if (DOM.statNeedsAttention) DOM.statNeedsAttention.textContent = attentionCount;
    if (DOM.statSum) {
      if (window.EternalPlanApp && window.EternalPlanApp.formatCurrency) {
        DOM.statSum.textContent = window.EternalPlanApp.formatCurrency(selectedSum);
      } else {
        DOM.statSum.textContent = '$' + selectedSum.toLocaleString();
      }
    }

    if (DOM.filterAllCount) DOM.filterAllCount.textContent = total;
    if (DOM.filterAttentionCount) DOM.filterAttentionCount.textContent = attentionCount;
    if (DOM.filterReadyCount) DOM.filterReadyCount.textContent = readyCount;

    if (DOM.confirmCount) DOM.confirmCount.textContent = selectedCount;

    // Master checkbox state
    if (DOM.masterCheckbox) {
      const allSelected = total > 0 && importState.items.every(i => i.included);
      const someSelected = importState.items.some(i => i.included);
      DOM.masterCheckbox.checked = allSelected;
      DOM.masterCheckbox.indeterminate = !allSelected && someSelected;
    }
  }

  function renderTableRows() {
    if (!DOM.tableBody) return;

    const filter = importState.activeFilter;
    const visibleItems = importState.items.filter(item => {
      if (filter === 'ready') return item.isReady;
      if (filter === 'attention') return !item.isReady;
      return true;
    });

    if (visibleItems.length === 0) {
      DOM.tableBody.innerHTML = `
        <tr>
          <td colspan="10" class="excel-empty-row">
            <div class="empty-state-box">
              <span class="empty-icon">✨</span>
              <p>No items found for filter "<strong>${escapeHtml(filter)}</strong>".</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const rowsHtml = visibleItems.map((item, idx) => {
      const isReady = item.isReady;
      const issuesText = item.missingIssues.length > 0 ? item.missingIssues.join(', ') : 'Ready';

      const statusBadge = isReady
        ? `<span class="badge-pill excel-badge-ready" title="All essential fields complete">✓ Ready</span>`
        : `<span class="badge-pill excel-badge-warning" title="${escapeHtml(issuesText)}">⚠️ ${escapeHtml(issuesText)}</span>`;

      // Category options
      const catOptions = [
        '<option value="">-- Choose Category --</option>',
        ...CATEGORIES.map(cat => {
          const isSel = item.categoryId === cat.id ? 'selected' : '';
          return `<option value="${cat.id}" ${isSel}>${cat.icon} ${escapeHtml(cat.name)}</option>`;
        })
      ].join('');

      const nameClass = !item.name ? 'excel-input-warning' : '';
      const costClass = (item.estimatedCost <= 0 && item.actualCost <= 0) ? 'excel-input-warning' : '';
      const catClass = !item.categoryId ? 'excel-input-warning' : '';

      return `
        <tr class="excel-data-row ${!item.included ? 'row-excluded' : ''} ${!isReady ? 'row-needs-attention' : ''}" data-item-id="${item.id}">
          <td style="text-align: center;">
            <input type="checkbox" class="row-checkbox" ${item.included ? 'checked' : ''} aria-label="Include item">
          </td>
          <td>
            ${statusBadge}
          </td>
          <td>
            <input type="text" class="form-control form-control-sm cell-name ${nameClass}" value="${escapeHtml(item.name)}" placeholder="Item name..." required>
          </td>
          <td>
            <select class="form-control form-control-sm cell-category ${catClass}">
              ${catOptions}
            </select>
          </td>
          <td>
            <div class="input-currency-wrapper">
              <span class="currency-prefix">$</span>
              <input type="number" class="form-control form-control-sm cell-est-cost ${costClass}" value="${item.estimatedCost || ''}" placeholder="0" min="0" step="1">
            </div>
          </td>
          <td>
            <div class="input-currency-wrapper">
              <span class="currency-prefix">$</span>
              <input type="number" class="form-control form-control-sm cell-act-cost" value="${item.actualCost || ''}" placeholder="Same" min="0" step="1">
            </div>
          </td>
          <td>
            <input type="date" class="form-control form-control-sm cell-due-date" value="${escapeHtml(item.dueDate)}">
          </td>
          <td>
            <input type="text" class="form-control form-control-sm cell-vendor" value="${escapeHtml(item.vendor)}" placeholder="Optional vendor">
          </td>
          <td>
            <input type="text" class="form-control form-control-sm cell-notes" value="${escapeHtml(item.notes)}" placeholder="Optional notes">
          </td>
          <td style="text-align: center;">
            <button type="button" class="btn btn-text btn-sm delete-row-btn" title="Remove this item from import">✕</button>
          </td>
        </tr>
      `;
    }).join('');

    DOM.tableBody.innerHTML = rowsHtml;
  }

  // =========================================================================
  // INTERACTIVE EDITING & TABLE EVENT DELEGATION
  // =========================================================================

  function setupTableEvents() {
    if (!DOM.tableBody) return;

    // Delegate row input changes
    DOM.tableBody.addEventListener('change', handleTableChange);
    DOM.tableBody.addEventListener('input', debounce(handleTableInput, 200));
    DOM.tableBody.addEventListener('click', handleTableClick);
  }

  function getItemFromEvent(e) {
    const tr = e.target.closest('tr[data-item-id]');
    if (!tr) return null;
    const id = tr.dataset.itemId;
    return importState.items.find(i => i.id === id);
  }

  function handleTableChange(e) {
    const item = getItemFromEvent(e);
    if (!item) return;

    if (e.target.classList.contains('row-checkbox')) {
      item.included = e.target.checked;
      const tr = e.target.closest('tr');
      if (tr) tr.classList.toggle('row-excluded', !item.included);
      updateKpis();
      return;
    }

    if (e.target.classList.contains('cell-category')) {
      item.categoryId = e.target.value || null;
      evaluateItemStatus(item);
      renderDashboard();
      return;
    }

    if (e.target.classList.contains('cell-due-date')) {
      item.dueDate = e.target.value;
      updateKpis();
      return;
    }
  }

  function handleTableInput(e) {
    const item = getItemFromEvent(e);
    if (!item) return;

    if (e.target.classList.contains('cell-name')) {
      item.name = e.target.value.trim();
      // If user types a name and category was empty, auto-resolve category!
      if (!item.categoryId && item.name) {
        const inferred = resolveCategory('', item.name);
        if (inferred) {
          item.categoryId = inferred;
          const tr = e.target.closest('tr');
          const catSelect = tr ? tr.querySelector('.cell-category') : null;
          if (catSelect) catSelect.value = inferred;
        }
      }
      evaluateItemStatus(item);
      updateKpis();
      return;
    }

    if (e.target.classList.contains('cell-est-cost')) {
      item.estimatedCost = parseCurrencyValue(e.target.value);
      if (item.actualCost <= 0) {
        item.actualCost = item.estimatedCost;
      }
      evaluateItemStatus(item);
      updateKpis();
      return;
    }

    if (e.target.classList.contains('cell-act-cost')) {
      item.actualCost = parseCurrencyValue(e.target.value);
      evaluateItemStatus(item);
      updateKpis();
      return;
    }

    if (e.target.classList.contains('cell-vendor')) {
      item.vendor = e.target.value;
      return;
    }

    if (e.target.classList.contains('cell-notes')) {
      item.notes = e.target.value;
      return;
    }
  }

  function handleTableClick(e) {
    if (e.target.classList.contains('delete-row-btn')) {
      const item = getItemFromEvent(e);
      if (!item) return;
      importState.items = importState.items.filter(i => i.id !== item.id);
      renderDashboard();
    }
  }

  // =========================================================================
  // BULK ACTIONS & QUICK FIXES
  // =========================================================================

  function applyBulkCategory() {
    if (!DOM.bulkCategorySelect) return;
    const catId = DOM.bulkCategorySelect.value;
    if (!catId) return;

    let appliedCount = 0;
    importState.items.forEach(item => {
      if (!item.categoryId) {
        item.categoryId = catId;
        appliedCount++;
      }
    });

    if (appliedCount > 0) {
      if (window.EternalPlanApp && window.EternalPlanApp.showToast) {
        window.EternalPlanApp.showToast(`Assigned ${appliedCount} items to category`);
      }
      renderDashboard();
    } else {
      alert('All items already have a category assigned.');
    }
  }

  function applyBulkDueDate(customDate = null) {
    let dateVal = customDate || (DOM.bulkDueDateInput ? DOM.bulkDueDateInput.value : '');
    if (!dateVal) {
      // Fallback to wedding date from state
      if (window.EternalPlanApp && window.EternalPlanApp.getState) {
        dateVal = window.EternalPlanApp.getState().weddingDate || '';
      }
    }

    if (!dateVal) {
      alert('Please enter or select a date to apply.');
      return;
    }

    let appliedCount = 0;
    importState.items.forEach(item => {
      if (!item.dueDate) {
        item.dueDate = dateVal;
        appliedCount++;
      }
    });

    if (appliedCount > 0) {
      if (window.EternalPlanApp && window.EternalPlanApp.showToast) {
        window.EternalPlanApp.showToast(`Set payment due date for ${appliedCount} items to ${dateVal}`);
      }
      renderDashboard();
    } else {
      alert('All items already have due dates.');
    }
  }

  function addNewManualRow() {
    let defaultDueDate = '';
    if (window.EternalPlanApp && window.EternalPlanApp.getState) {
      defaultDueDate = window.EternalPlanApp.getState().weddingDate || '';
    }

    const newItem = {
      id: 'imp-item-manual-' + Date.now(),
      rowIndex: importState.items.length,
      included: true,
      name: '',
      vendor: '',
      notes: '',
      estimatedCost: 0,
      actualCost: 0,
      dueDate: defaultDueDate,
      categoryId: CATEGORIES[0].id,
      missingIssues: ['Missing Name', 'Missing Cost'],
      isReady: false
    };

    importState.items.unshift(newItem); // Add to top for instant visibility
    renderDashboard();

    // Focus on the new item name field
    setTimeout(() => {
      const firstRow = DOM.tableBody ? DOM.tableBody.querySelector('tr[data-item-id="' + newItem.id + '"]') : null;
      if (firstRow) {
        const input = firstRow.querySelector('.cell-name');
        if (input) input.focus();
      }
    }, 50);
  }

  function handleColumnMappingChange() {
    importState.columnMappings = {
      name: parseInt(DOM.mapNameCol.value, 10),
      category: parseInt(DOM.mapCategoryCol.value, 10),
      estimatedCost: parseInt(DOM.mapEstCostCol.value, 10),
      actualCost: parseInt(DOM.mapActCostCol.value, 10),
      dueDate: parseInt(DOM.mapDueDateCol.value, 10),
      vendor: parseInt(DOM.mapVendorCol.value, 10),
      notes: parseInt(DOM.mapNotesCol.value, 10)
    };

    updateMappingSummaryText();
    // Reparse raw rows with new column mappings
    parseItemsFromRows();
    renderDashboard();
    if (window.EternalPlanApp && window.EternalPlanApp.showToast) {
      window.EternalPlanApp.showToast('Updated spreadsheet column mappings');
    }
  }

  // =========================================================================
  // DOWNLOAD STARTER SPREADSHEET TEMPLATE
  // =========================================================================

  function downloadSampleTemplate() {
    const csvContent = [
      'Category,Item / Expense Name,Vendor,Estimated Cost,Actual Cost,Due Date,Notes',
      'Venue & Catering,Grand Ballroom Reception Dinner,Grandview Estate,12000,12000,2026-10-15,Includes tables linens and dinner for 120 guests',
      'Photography & Video,Full Day Wedding Photo & Video,Luminary Visuals,3800,3800,2026-09-01,8 hours coverage with drone footage and second shooter',
      'Attire, Rings & Beauty,Bridal Gown & Alterations,The White Room Boutique,2200,2200,2026-08-15,Deposit paid fitting scheduled',
      'Floral & Decor,Centerpieces & Ceremony Florals,Petal & Bloom Studios,1800,1800,2026-10-01,12 floral centerpieces and bridal party bouquets',
      'Music & Entertainment,Live Band & Reception DJ,SoundWave Ensemble,2500,2500,2026-10-10,Reception music plus cocktail hour quartet',
      'Stationery & Invites,Custom Foil Invitations & Save the Dates,Paper & Grace,650,650,2026-06-01,Includes RSVP cards and postage',
      'Cake & Desserts,3-Tier Custom Wedding Cake,Sweet Elegance Bakery,750,750,2026-10-15,Lemon elderflower and vanilla bean layers',
      'Officiant & Legal,Officiant Ceremony Fee & License,Rev. Michael Hayes,450,450,2026-10-15,Rehearsal attendance included',
      'Transport & Favors,Guest Shuttle Service,Premier Coaches,1200,1200,2026-09-20,Round trip shuttle between hotel and venue',
      'Honeymoon & Cushion,Emergency Wedding Cushion Reserve,Self,2000,2000,2026-10-15,Reserved for last-minute tips and vendor adjustments'
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eternalplan_wedding_budget_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.EternalPlanApp && window.EternalPlanApp.showToast) {
      window.EternalPlanApp.showToast('Downloaded wedding budget template (.csv)');
    }
  }

  // =========================================================================
  // CONFIRM & IMPORT COMMIT EXECUTION
  // =========================================================================

  function handleConfirmImport() {
    if (!window.EternalPlanApp) {
      alert('EternalPlan core application is not ready.');
      return;
    }

    const selectedItems = importState.items.filter(i => i.included && i.name.trim() !== '');

    if (selectedItems.length === 0) {
      alert('No valid items are currently selected for import. Please check at least one item with a valid name.');
      return;
    }

    // Check if there are unready items selected
    const unreadySelected = selectedItems.filter(i => !i.isReady);
    if (unreadySelected.length > 0) {
      const confirmProceed = confirm(
        `Notice: ${unreadySelected.length} of your selected items are missing either a cost or a category.\n\nMissing categories will default to "Venue & Catering" and missing costs will be set to $0.\n\nDo you want to proceed and import anyway?`
      );
      if (!confirmProceed) return;
    }

    const state = window.EternalPlanApp.getState();
    const weddingDate = state.weddingDate || new Date().toISOString().split('T')[0];

    // Determine import mode: 'append' or 'replace'
    const modeRadio = document.querySelector('input[name="excelImportMode"]:checked');
    const isReplace = modeRadio && modeRadio.value === 'replace';

    if (isReplace) {
      const confirmReplace = confirm(
        'Warning: You selected "Replace existing expenses". This will replace all your current expenses with this spreadsheet import. Are you sure?'
      );
      if (!confirmReplace) return;
    }

    // Build standard ExpenseItem objects
    const newExpenses = selectedItems.map((item, idx) => {
      const expId = 'exp-imp-' + Date.now() + '-' + idx;
      const catId = item.categoryId || 'venue-catering';
      const name = item.name.trim();
      const vendor = (item.vendor || '').trim();
      const notes = (item.notes || '').trim();
      const estimatedCost = Number(item.estimatedCost) || 0;
      let actualCost = Number(item.actualCost) || 0;
      if (actualCost <= 0) actualCost = estimatedCost;

      const dueDate = item.dueDate || weddingDate;

      // Create milestone schedule installment
      const milestones = [];
      if (actualCost > 0) {
        milestones.push({
          id: `m-${expId}-0-${Date.now()}`,
          title: `Full Payment on ${dueDate === weddingDate ? 'Wedding Day' : dueDate}`,
          amount: actualCost,
          dueDate: dueDate,
          isPaid: false,
          paidDate: null
        });
      }

      return {
        id: expId,
        categoryId: catId,
        name: name,
        vendor: vendor,
        estimatedCost: estimatedCost,
        actualCost: actualCost,
        notes: notes,
        milestones: milestones
      };
    });

    // Commit to state
    if (isReplace) {
      state.expenses = newExpenses;
    } else {
      state.expenses = [...(state.expenses || []), ...newExpenses];
    }

    // Save state and re-render everything
    window.EternalPlanApp.saveState(true, true);
    window.EternalPlanApp.renderAll();

    // Close modal and show celebration toast
    closeModal();
    resetImportState();

    const totalImportedCost = newExpenses.reduce((acc, x) => acc + (x.actualCost || x.estimatedCost || 0), 0);
    const costFormatted = window.EternalPlanApp.formatCurrency
      ? window.EternalPlanApp.formatCurrency(totalImportedCost)
      : '$' + totalImportedCost.toLocaleString();

    window.EternalPlanApp.showToast(
      `✨ Successfully imported ${newExpenses.length} expenses (${costFormatted}) into your wedding budget!`,
      '📊'
    );

    // Switch view to Budget & Expenses tab so user immediately sees their imported items
    if (window.EternalPlanApp.switchTab) {
      window.EternalPlanApp.switchTab('budget');
    }
  }

  // =========================================================================
  // ATTACH ALL DOM EVENT LISTENERS
  // =========================================================================

  function attachListeners() {
    initDomElements();

    // Open Modal Triggers
    if (DOM.openHeaderBtn) DOM.openHeaderBtn.addEventListener('click', openModal);
    if (DOM.openBudgetBtn) DOM.openBudgetBtn.addEventListener('click', openModal);
    if (DOM.openDataModalBtn) {
      DOM.openDataModalBtn.addEventListener('click', () => {
        const dataModal = document.getElementById('dataModal');
        if (dataModal && dataModal.open) dataModal.close();
        openModal();
      });
    }

    // Close Modal Triggers
    if (DOM.closeBtn) DOM.closeBtn.addEventListener('click', closeModal);
    if (DOM.cancelBtn) DOM.cancelBtn.addEventListener('click', closeModal);

    // Dropzone / File Picker
    if (DOM.dropzone && DOM.fileInput) {
      DOM.dropzone.addEventListener('click', () => DOM.fileInput.click());
      DOM.dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          DOM.fileInput.click();
        }
      });

      // Drag and drop support
      ['dragenter', 'dragover'].forEach(eventName => {
        DOM.dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          DOM.dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        DOM.dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          DOM.dropzone.classList.remove('dragover');
        });
      });

      DOM.dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
          handleFileSelected(files[0]);
        }
      });

      DOM.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handleFileSelected(e.target.files[0]);
        }
      });
    }

    // Re-upload Button
    if (DOM.reuploadBtn) DOM.reuploadBtn.addEventListener('click', resetImportState);

    // Sheet Selector Change
    if (DOM.sheetSelect) {
      DOM.sheetSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          loadSheet(e.target.value);
        }
      });
    }

    // Template Downloads
    if (DOM.downloadTemplateBtn) DOM.downloadTemplateBtn.addEventListener('click', downloadSampleTemplate);
    if (DOM.downloadTemplateBottomBtn) DOM.downloadTemplateBottomBtn.addEventListener('click', downloadSampleTemplate);

    // Mapping Selects Listeners
    const mappingSelects = [
      DOM.mapNameCol, DOM.mapCategoryCol, DOM.mapEstCostCol,
      DOM.mapActCostCol, DOM.mapDueDateCol, DOM.mapVendorCol, DOM.mapNotesCol
    ];
    mappingSelects.forEach(sel => {
      if (sel) sel.addEventListener('change', handleColumnMappingChange);
    });

    // Filter Buttons
    if (DOM.filterAllBtn) {
      DOM.filterAllBtn.addEventListener('click', () => setFilter('all'));
    }
    if (DOM.filterAttentionBtn) {
      DOM.filterAttentionBtn.addEventListener('click', () => setFilter('attention'));
    }
    if (DOM.filterReadyBtn) {
      DOM.filterReadyBtn.addEventListener('click', () => setFilter('ready'));
    }

    // Bulk Actions
    if (DOM.applyBulkCategoryBtn) DOM.applyBulkCategoryBtn.addEventListener('click', applyBulkCategory);
    if (DOM.applyBulkDueDateBtn) DOM.applyBulkDueDateBtn.addEventListener('click', () => applyBulkDueDate());
    if (DOM.applyWeddingDateBulkBtn) {
      DOM.applyWeddingDateBulkBtn.addEventListener('click', () => {
        if (window.EternalPlanApp && window.EternalPlanApp.getState) {
          const wDate = window.EternalPlanApp.getState().weddingDate;
          if (wDate) {
            applyBulkDueDate(wDate);
          } else {
            alert('Your wedding date is not set yet in Wedding Settings.');
          }
        }
      });
    }

    // Select / Deselect All
    if (DOM.selectAllBtn) {
      DOM.selectAllBtn.addEventListener('click', () => {
        importState.items.forEach(i => i.included = true);
        renderDashboard();
      });
    }
    if (DOM.deselectAllBtn) {
      DOM.deselectAllBtn.addEventListener('click', () => {
        importState.items.forEach(i => i.included = false);
        renderDashboard();
      });
    }
    if (DOM.masterCheckbox) {
      DOM.masterCheckbox.addEventListener('change', (e) => {
        const checked = e.target.checked;
        importState.items.forEach(i => i.included = checked);
        renderDashboard();
      });
    }

    // Add Manual Row
    if (DOM.addNewRowBtn) DOM.addNewRowBtn.addEventListener('click', addNewManualRow);

    // Confirm Import
    if (DOM.confirmBtn) DOM.confirmBtn.addEventListener('click', handleConfirmImport);

    // Setup interactive table events
    setupTableEvents();
  }

  function setFilter(filterName) {
    importState.activeFilter = filterName;
    if (DOM.filterAllBtn) DOM.filterAllBtn.classList.toggle('active', filterName === 'all');
    if (DOM.filterAttentionBtn) DOM.filterAttentionBtn.classList.toggle('active', filterName === 'attention');
    if (DOM.filterReadyBtn) DOM.filterReadyBtn.classList.toggle('active', filterName === 'ready');
    renderTableRows();
  }

  // Utility debounce
  function debounce(fn, ms) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Initialize once document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachListeners);
  } else {
    attachListeners();
  }
})();
