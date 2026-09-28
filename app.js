// app.js - Wedding Budget & Due-Date Savings Planner Logic

(function() {
  'use strict';

  // Storage Key
  const STORAGE_KEY = 'wedding_budget_planner_data_v1';

  // Application State
  let state = {
    coupleNames: '',
    weddingDate: '',
    hasTargetBudget: false,
    targetBudget: 0,
    currentSavings: 0,
    paycheckCadence: 'bi-weekly',
    plannedSavingsPerPaycheck: 0,
    safetyCushion: 1000,
    expenses: []
  };

  let activeTab = 'dashboard';
  let scheduleFilter = 'all-unpaid';
  let activeExpenseModalId = null;

  // DOM Elements
  const DOM = {
    // Header & Hero
    brandMonogram: document.getElementById('brandMonogram'),
    coupleHeading: document.getElementById('coupleHeading'),
    displayWeddingDate: document.getElementById('displayWeddingDate'),
    countdownDaysText: document.getElementById('countdownDaysText'),
    cdDays: document.getElementById('cdDays'),
    cdHours: document.getElementById('cdHours'),
    cdMins: document.getElementById('cdMins'),
    cdSecs: document.getElementById('cdSecs'),
    currentCadenceLabel: document.getElementById('currentCadenceLabel'),

    // Buttons
    openAddExpenseBtn: document.getElementById('openAddExpenseBtn'),
    addExpenseFromScheduleBtn: document.getElementById('addExpenseFromScheduleBtn'),
    addExpenseFromBudgetBtn: document.getElementById('addExpenseFromBudgetBtn'),
    openSettingsBtn: document.getElementById('openSettingsBtn'),
    openDataToolsBtn: document.getElementById('openDataToolsBtn'),
    printReportBtn: document.getElementById('printReportBtn'),
    jumpToSimulatorBtn: document.getElementById('jumpToSimulatorBtn'),
    viewAllScheduleBtn: document.getElementById('viewAllScheduleBtn'),
    toggleAllCategoriesBtn: document.getElementById('toggleAllCategoriesBtn'),
    autoSolvePaceBtn: document.getElementById('autoSolvePaceBtn'),

    // Tabs
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabPanes: {
      dashboard: document.getElementById('tab-dashboard'),
      schedule: document.getElementById('tab-schedule'),
      budget: document.getElementById('tab-budget'),
      simulator: document.getElementById('tab-simulator')
    },
    unpaidMilestonesCount: document.getElementById('unpaidMilestonesCount'),

    // Crunch Banner
    crunchAlertBanner: document.getElementById('crunchAlertBanner'),
    crunchBannerIcon: document.getElementById('crunchBannerIcon'),
    crunchBannerTitle: document.getElementById('crunchBannerTitle'),
    crunchBannerText: document.getElementById('crunchBannerText'),
    crunchNextAmount: document.getElementById('crunchNextAmount'),
    crunchNextPace: document.getElementById('crunchNextPace'),
    crunchPaceLabel: document.getElementById('crunchPaceLabel'),

    // KPI Cards
    kpiTargetBudget: document.getElementById('kpiTargetBudget'),
    kpiBudgetTitle: document.getElementById('kpiBudgetTitle'),
    kpiBudgetIcon: document.getElementById('kpiBudgetIcon'),
    kpiBudgetDiff: document.getElementById('kpiBudgetDiff'),
    kpiBudgetBar: document.getElementById('kpiBudgetBar'),
    kpiActualCost: document.getElementById('kpiActualCost'),
    kpiAllocatedMeta: document.getElementById('kpiAllocatedMeta'),
    kpiActualBar: document.getElementById('kpiActualBar'),
    kpiPaidSoFar: document.getElementById('kpiPaidSoFar'),
    kpiPaidPct: document.getElementById('kpiPaidPct'),
    kpiPaidBar: document.getElementById('kpiPaidBar'),
    kpiRemainingDue: document.getElementById('kpiRemainingDue'),
    kpiUpcomingCount: document.getElementById('kpiUpcomingCount'),
    kpiRemainingBar: document.getElementById('kpiRemainingBar'),
    kpiCurrentSavings: document.getElementById('kpiCurrentSavings'),
    kpiSavingsGap: document.getElementById('kpiSavingsGap'),
    kpiSavingsCoverageBar: document.getElementById('kpiSavingsCoverageBar'),

    // Velocity Rates
    ratePerDay: document.getElementById('ratePerDay'),
    ratePerWeek: document.getElementById('ratePerWeek'),
    ratePerPaycheck: document.getElementById('ratePerPaycheck'),
    ratePerMonth: document.getElementById('ratePerMonth'),
    velocityAdviceText: document.getElementById('velocityAdviceText'),
    rateBoxes: {
      day: document.getElementById('rateBoxDay'),
      week: document.getElementById('rateBoxWeek'),
      paycheck: document.getElementById('rateBoxPaycheck'),
      month: document.getElementById('rateBoxMonth')
    },

    // Lists & Containers
    dashboardMilestonesList: document.getElementById('dashboardMilestonesList'),
    fullTimelineList: document.getElementById('fullTimelineList'),
    budgetCategoryGroupsContainer: document.getElementById('budgetCategoryGroupsContainer'),
    categoryLegendList: document.getElementById('categoryLegendList'),
    summaryTotalEstimated: document.getElementById('summaryTotalEstimated'),
    summaryItemCount: document.getElementById('summaryItemCount'),
    summaryTotalActual: document.getElementById('summaryTotalActual'),
    summaryTargetBudget: document.getElementById('summaryTargetBudget'),
    toggleBudgetModeInlineBtn: document.getElementById('toggleBudgetModeInlineBtn'),

    // Simulator
    simCurrentSavings: document.getElementById('simCurrentSavings'),
    simPaycheckCadence: document.getElementById('simPaycheckCadence'),
    simPlannedSavings: document.getElementById('simPlannedSavings'),
    simSafetyCushion: document.getElementById('simSafetyCushion'),
    simStatusBanner: document.getElementById('simStatusBanner'),
    simStatusIcon: document.getElementById('simStatusIcon'),
    simStatusHeading: document.getElementById('simStatusHeading'),
    simStatusDetail: document.getElementById('simStatusDetail'),
    simBreakdownBody: document.getElementById('simBreakdownBody'),

    // Canvases
    cashflowCanvas: document.getElementById('cashflowCanvas'),
    categoryDonutCanvas: document.getElementById('categoryDonutCanvas'),
    chartStatusPill: document.getElementById('chartStatusPill'),

    // Modals
    expenseModal: document.getElementById('expenseModal'),
    expenseForm: document.getElementById('expenseForm'),
    modalTitle: document.getElementById('modalTitle'),
    editExpenseId: document.getElementById('editExpenseId'),
    expenseCategory: document.getElementById('expenseCategory'),
    expenseName: document.getElementById('expenseName'),
    expenseVendor: document.getElementById('expenseVendor'),
    expenseEstimatedCost: document.getElementById('expenseEstimatedCost'),
    expenseActualCost: document.getElementById('expenseActualCost'),
    modalMilestonesContainer: document.getElementById('modalMilestonesContainer'),
    addMilestoneRowBtn: document.getElementById('addMilestoneRowBtn'),
    autoFillMilestoneBtn: document.getElementById('autoFillMilestoneBtn'),
    expenseNotes: document.getElementById('expenseNotes'),
    closeExpenseModalBtn: document.getElementById('closeExpenseModalBtn'),
    cancelExpenseModalBtn: document.getElementById('cancelExpenseModalBtn'),

    settingsModal: document.getElementById('settingsModal'),
    settingsForm: document.getElementById('settingsForm'),
    setCoupleNames: document.getElementById('setCoupleNames'),
    setWeddingDate: document.getElementById('setWeddingDate'),
    setHasTargetBudget: document.getElementById('setHasTargetBudget'),
    targetBudgetInputWrapper: document.getElementById('targetBudgetInputWrapper'),
    setTargetBudget: document.getElementById('setTargetBudget'),
    setCurrentSavings: document.getElementById('setCurrentSavings'),
    setPaycheckCadence: document.getElementById('setPaycheckCadence'),
    setPlannedPaycheck: document.getElementById('setPlannedPaycheck'),
    setSafetyCushion: document.getElementById('setSafetyCushion'),
    closeSettingsModalBtn: document.getElementById('closeSettingsModalBtn'),
    cancelSettingsModalBtn: document.getElementById('cancelSettingsModalBtn'),

    dataModal: document.getElementById('dataModal'),
    closeDataModalBtn: document.getElementById('closeDataModalBtn'),
    exportJsonBtn: document.getElementById('exportJsonBtn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    importJsonInput: document.getElementById('importJsonInput'),
    loadSampleDataBtn: document.getElementById('loadSampleDataBtn'),
    resetAllDataBtn: document.getElementById('resetAllDataBtn'),

    toastContainer: document.getElementById('toastContainer')
  };

  // =========================================================================
  // INITIALIZATION & STATE MANAGEMENT
  // =========================================================================
  function init() {
    loadState();
    setupEventListeners();
    setupTooltipListeners();
    populateCategorySelect();
    startCountdownTimer();
    renderAll();
  }

  const BLANK_STATE = {
    coupleNames: '',
    weddingDate: '',
    hasTargetBudget: false,
    targetBudget: 0,
    currentSavings: 0,
    paycheckCadence: 'bi-weekly',
    plannedSavingsPerPaycheck: 0,
    safetyCushion: 1000,
    expenses: []
  };

  function getBlankState() {
    return JSON.parse(JSON.stringify(BLANK_STATE));
  }

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        state = JSON.parse(saved);

        // Detect if previously saved state is legacy demo/sample data for random people ("Sophia & Liam" or "Elena & Julian")
        const isLegacySample = (
          (state.coupleNames === 'Sophia & Liam' || state.coupleNames === 'Elena & Julian') &&
          Array.isArray(state.expenses) &&
          state.expenses.some(e => e.id === 'exp-1' || e.name === 'Grand Garden Estate Venue Rental' || e.name === 'Château Grandview Estate') &&
          !state._explicitSampleLoaded
        );

        if (isLegacySample) {
          state = getBlankState();
          saveState();
        } else {
          if (state.hasTargetBudget === undefined) {
            state.hasTargetBudget = false;
          }
          if (!Array.isArray(state.expenses)) {
            state.expenses = [];
          }
        }
      } catch (e) {
        console.error('Failed to parse saved state, starting blank slate', e);
        state = getBlankState();
        saveState();
      }
    } else {
      // First visit: start with a fresh blank slate
      state = getBlankState();
      saveState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function showToast(message, icon = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // =========================================================================
  // HELPERS: FORMATTING & TIME
  // =========================================================================
  function formatCurrency(num) {
    if (isNaN(num)) return '$0';
    return '$' + Math.round(num).toLocaleString('en-US');
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'Not set yet';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getDaysRemaining(dateStr) {
    if (!dateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = dateStr.split('-');
    const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getCadenceDays(cadence) {
    switch (cadence) {
      case 'weekly': return 7;
      case 'bi-weekly': return 14;
      case 'semi-monthly': return 15.208;
      case 'monthly': return 30.417;
      default: return 14;
    }
  }

  function getCadenceName(cadence) {
    switch (cadence) {
      case 'weekly': return 'Weekly';
      case 'bi-weekly': return 'Bi-Weekly';
      case 'semi-monthly': return 'Semi-Monthly';
      case 'monthly': return 'Monthly';
      default: return 'Bi-Weekly';
    }
  }

  function generateMonogram(names) {
    if (!names) return '💍';
    const parts = names.split(/&|\band\b/i).map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + '&' + parts[1][0]).toUpperCase();
    }
    return names.substring(0, 2).toUpperCase();
  }

  // =========================================================================
  // LIVE COUNTDOWN TIMER
  // =========================================================================
  function startCountdownTimer() {
    function updateTicker() {
      if (!state.weddingDate) {
        DOM.cdDays.textContent = '--';
        DOM.cdHours.textContent = '--';
        DOM.cdMins.textContent = '--';
        DOM.cdSecs.textContent = '--';
        DOM.countdownDaysText.textContent = "No date set";
        return;
      }
      const parts = state.weddingDate.split('-');
      const weddingTime = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)).getTime();
      const now = new Date().getTime();
      const distance = weddingTime - now;

      if (distance < 0) {
        DOM.cdDays.textContent = '00';
        DOM.cdHours.textContent = '00';
        DOM.cdMins.textContent = '00';
        DOM.cdSecs.textContent = '00';
        DOM.countdownDaysText.textContent = "Wedding Day Celebrated! 🎉";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      DOM.cdDays.textContent = String(days).padStart(2, '0');
      DOM.cdHours.textContent = String(hours).padStart(2, '0');
      DOM.cdMins.textContent = String(minutes).padStart(2, '0');
      DOM.cdSecs.textContent = String(seconds).padStart(2, '0');

      DOM.countdownDaysText.textContent = `${days} days away`;
    }

    updateTicker();
    setInterval(updateTicker, 1000);
  }

  // =========================================================================
  // MILESTONE & CASHFLOW ENGINE (THE CORE VALUE PROPOSITION)
  // =========================================================================
  function getAllMilestones() {
    const list = [];
    state.expenses.forEach(exp => {
      if (!exp.milestones) return;
      exp.milestones.forEach(m => {
        list.push({
          expenseId: exp.id,
          expenseName: exp.name,
          categoryId: exp.categoryId,
          vendor: exp.vendor || 'Independent / Unassigned',
          milestoneId: m.id,
          title: m.title || 'Payment',
          amount: Number(m.amount) || 0,
          dueDate: m.dueDate,
          isPaid: Boolean(m.isPaid),
          paidDate: m.paidDate || null,
          daysRemaining: getDaysRemaining(m.dueDate)
        });
      });
    });

    // Sort chronologically by dueDate
    list.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

    return list;
  }

  function calculateFinancialAnalytics() {
    const milestones = getAllMilestones();
    const unpaid = milestones.filter(m => !m.isPaid);
    const paid = milestones.filter(m => m.isPaid);

    const targetBudget = Number(state.targetBudget) || 0;
    const currentSavings = Number(state.currentSavings) || 0;
    const safetyCushion = Number(state.safetyCushion) || 1000;
    const cadenceDays = getCadenceDays(state.paycheckCadence);
    const plannedSavings = Number(state.plannedSavingsPerPaycheck) || 0;

    let totalEstimated = 0;
    let totalActual = 0;
    state.expenses.forEach(exp => {
      const est = Number(exp.estimatedCost) || 0;
      const act = Number(exp.actualCost) || 0;
      totalEstimated += est;
      totalActual += (act > 0 ? act : est);
    });

    const totalPaid = paid.reduce((sum, m) => sum + m.amount, 0);
    const totalRemainingDue = unpaid.reduce((sum, m) => sum + m.amount, 0);

    // Days to wedding
    const hasWeddingDate = Boolean(state.weddingDate);
    const rawDays = getDaysRemaining(state.weddingDate);
    const daysToWedding = hasWeddingDate ? Math.max(1, rawDays) : 0;
    const weeksToWedding = daysToWedding > 0 ? Math.max(1 / 7, daysToWedding / 7) : 0;
    const paychecksToWedding = daysToWedding > 0 ? Math.max(1 / cadenceDays, daysToWedding / cadenceDays) : 0;
    const monthsToWedding = daysToWedding > 0 ? Math.max(1 / 30.4, daysToWedding / 30.417) : 0;

    // Net savings gap needed to cover everything by wedding day
    const netGapToWedding = Math.max(0, totalRemainingDue - currentSavings);

    // Overall wedding velocity rates
    const velocity = {
      perDay: (hasWeddingDate && daysToWedding > 0) ? (netGapToWedding / daysToWedding) : 0,
      perWeek: (hasWeddingDate && weeksToWedding > 0) ? (netGapToWedding / weeksToWedding) : 0,
      perPaycheck: (hasWeddingDate && paychecksToWedding > 0) ? (netGapToWedding / paychecksToWedding) : 0,
      perMonth: (hasWeddingDate && monthsToWedding > 0) ? (netGapToWedding / monthsToWedding) : 0
    };

    // Calculate cumulative due & required savings per milestone
    let runningCumulativeUnpaid = 0;
    let peakRequiredPaycheckRate = 0;
    let bottleneckMilestone = null;
    let nextUpcomingMilestone = null;

    unpaid.forEach((m, index) => {
      runningCumulativeUnpaid += m.amount;
      m.cumulativeUnpaidDue = runningCumulativeUnpaid;

      // Net new money couple must save between today and this milestone
      const netSavingsNeededByDate = Math.max(0, runningCumulativeUnpaid - currentSavings);
      m.netSavingsNeededByDate = netSavingsNeededByDate;

      // Time units
      const dRem = Math.max(1, m.daysRemaining);
      const wRem = Math.max(1 / 7, dRem / 7);
      const pRem = Math.max(1 / cadenceDays, dRem / cadenceDays);
      const mRem = Math.max(1 / 30.4, dRem / 30.417);

      m.requiredRate = {
        perDay: netSavingsNeededByDate / dRem,
        perWeek: netSavingsNeededByDate / wRem,
        perPaycheck: netSavingsNeededByDate / pRem,
        perMonth: netSavingsNeededByDate / mRem
      };

      if (!nextUpcomingMilestone && m.daysRemaining >= 0) {
        nextUpcomingMilestone = m;
      }

      // Track milestone causing peak savings rate
      if (m.requiredRate.perPaycheck > peakRequiredPaycheckRate) {
        peakRequiredPaycheckRate = m.requiredRate.perPaycheck;
        bottleneckMilestone = m;
      }
    });

    // If all due dates are in the past, pick the first unpaid
    if (!nextUpcomingMilestone && unpaid.length > 0) {
      nextUpcomingMilestone = unpaid[0];
    }

    // Cashflow simulation across time
    const simulation = simulateCashflow(milestones, currentSavings, plannedSavings, cadenceDays, safetyCushion, state.weddingDate);

    return {
      targetBudget,
      totalEstimated,
      totalActual,
      totalPaid,
      totalRemainingDue,
      currentSavings,
      netGapToWedding,
      daysToWedding,
      paychecksToWedding,
      cadenceDays,
      plannedSavings,
      safetyCushion,
      velocity,
      milestones,
      unpaid,
      paid,
      bottleneckMilestone,
      nextUpcomingMilestone,
      simulation
    };
  }

  // Cashflow simulator step-by-step
  function simulateCashflow(allMilestones, startingSavings, plannedPerPaycheck, cadenceDays, safetyCushion, weddingDateStr) {
    const unpaid = allMilestones.filter(m => !m.isPaid);
    if (unpaid.length === 0) {
      return {
        hasDeficit: false,
        minBalance: startingSavings,
        deficitAmount: 0,
        deficitDate: null,
        recommendedPaycheckSavings: 0,
        timelineSteps: []
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentBalance = startingSavings;
    let minBalance = startingSavings;
    let deficitAmount = 0;
    let firstDeficitDate = null;
    let firstDeficitMilestone = null;

    // Build timeline events
    const timelineSteps = [];
    let runningPaychecks = 0;

    // Track ideal minimal paycheck savings to never dip below safetyCushion
    let maxRecommendedPaycheck = 0;
    let cumulativeOutflow = 0;

    unpaid.forEach((m) => {
      cumulativeOutflow += m.amount;
      const days = Math.max(0, m.daysRemaining);
      const paychecksByDate = Math.floor(days / cadenceDays);

      // Current projection
      const projectedBalance = startingSavings + (paychecksByDate * plannedPerPaycheck) - cumulativeOutflow;

      if (projectedBalance < minBalance) {
        minBalance = projectedBalance;
      }

      if (projectedBalance < safetyCushion && !firstDeficitDate) {
        firstDeficitDate = m.dueDate;
        firstDeficitMilestone = m;
        deficitAmount = safetyCushion - projectedBalance;
      }

      // Compute required paycheck rate for this milestone
      if (paychecksByDate > 0) {
        const requiredP = (cumulativeOutflow + safetyCushion - startingSavings) / paychecksByDate;
        if (requiredP > maxRecommendedPaycheck) {
          maxRecommendedPaycheck = requiredP;
        }
      } else {
        // Immediate bill before first paycheck
        if (cumulativeOutflow + safetyCushion > startingSavings) {
          maxRecommendedPaycheck = Math.max(maxRecommendedPaycheck, cumulativeOutflow + safetyCushion - startingSavings);
        }
      }

      timelineSteps.push({
        milestone: m,
        daysRemaining: m.daysRemaining,
        paychecksReceived: paychecksByDate,
        cumulativeDue: cumulativeOutflow,
        projectedBalance: projectedBalance,
        isDeficit: projectedBalance < safetyCushion
      });
    });

    return {
      hasDeficit: minBalance < safetyCushion,
      minBalance: minBalance,
      deficitAmount: Math.max(0, safetyCushion - minBalance),
      deficitDate: firstDeficitDate,
      deficitMilestone: firstDeficitMilestone,
      recommendedPaycheckSavings: Math.ceil(Math.max(0, maxRecommendedPaycheck)),
      timelineSteps: timelineSteps
    };
  }

  // =========================================================================
  // RENDERING CONTROLLERS
  // =========================================================================
  function renderAll() {
    const data = calculateFinancialAnalytics();

    renderHeader(data);
    renderCrunchBanner(data);
    renderKpiCards(data);
    renderVelocitySection(data);
    renderDashboardMilestones(data);
    renderFullSchedule(data);
    renderBudgetManager(data);
    renderSimulator(data);
    renderCharts(data);
  }

  function renderHeader(data) {
    DOM.brandMonogram.textContent = generateMonogram(state.coupleNames);
    DOM.coupleHeading.textContent = state.coupleNames ? `${state.coupleNames}'s Wedding` : 'Our Wedding Budget';
    DOM.displayWeddingDate.textContent = formatDate(state.weddingDate);
    DOM.currentCadenceLabel.textContent = `${getCadenceName(state.paycheckCadence)} (${formatCurrency(state.plannedSavingsPerPaycheck)})`;
    DOM.unpaidMilestonesCount.textContent = data.unpaid.length;
  }

  function renderCrunchBanner(data) {
    const banner = DOM.crunchAlertBanner;
    const sim = data.simulation;
    const next = data.nextUpcomingMilestone;
    const cadence = getCadenceName(state.paycheckCadence);

    if (data.milestones.length === 0) {
      banner.className = 'crunch-banner';
      banner.style.borderLeftColor = 'var(--gold-primary)';
      DOM.crunchBannerIcon.textContent = '💍';
      DOM.crunchBannerTitle.textContent = 'Welcome to Your Wedding Budget Planner';
      DOM.crunchBannerText.innerHTML = `
        Your planner is ready as a clean blank slate! Click <strong>+ Add Expense</strong> to start adding estimated costs and payment milestones, 
        or open <button type="button" class="btn-link-action" id="bannerOpenSettingsBtn">Settings</button> to customize your wedding date and savings frequency.
      `;
      DOM.crunchNextAmount.textContent = '$0';
      DOM.crunchPaceLabel.textContent = 'Next Milestone';
      DOM.crunchNextPace.textContent = 'None yet';
      DOM.crunchNextPace.className = 'crunch-stat-value';
      DOM.chartStatusPill.textContent = 'Blank Slate';
      DOM.chartStatusPill.className = 'badge-pill badge-upcoming';

      const bannerSettingsBtn = document.getElementById('bannerOpenSettingsBtn');
      if (bannerSettingsBtn) bannerSettingsBtn.onclick = openSettingsModal;
      return;
    }

    if (data.unpaid.length === 0) {
      banner.className = 'crunch-banner';
      banner.style.borderLeftColor = 'var(--sage-primary)';
      DOM.crunchBannerIcon.textContent = '🎉';
      DOM.crunchBannerTitle.textContent = 'All Wedding Payments Are 100% Complete!';
      DOM.crunchBannerText.textContent = 'You have paid all vendor milestones. Congratulations on reaching complete financial freedom for your big day!';
      DOM.crunchNextAmount.textContent = '$0';
      DOM.crunchNextPace.textContent = 'Done!';
      DOM.crunchNextPace.className = 'crunch-stat-value';
      DOM.chartStatusPill.textContent = 'All Paid';
      DOM.chartStatusPill.className = 'badge-pill badge-paid';
      return;
    }

    if (sim.hasDeficit) {
      banner.className = 'crunch-banner has-deficit';
      DOM.crunchBannerIcon.textContent = '⚠️';
      DOM.crunchBannerTitle.textContent = `Cash Shortfall Alert by ${formatDate(sim.deficitDate)}`;
      DOM.crunchBannerText.innerHTML = `
        At your current pace of <strong>${formatCurrency(state.plannedSavingsPerPaycheck)}/${cadence}</strong>, 
        you will experience a <strong>${formatCurrency(sim.deficitAmount)} cash deficit</strong> when paying 
        <em>${sim.deficitMilestone ? sim.deficitMilestone.title : 'upcoming milestones'}</em>.
        <div style="margin-top: 8px;">
          <button class="btn btn-primary btn-sm" id="bannerFixDeficitBtn" style="font-size: 0.82rem; padding: 6px 14px;">
            ⚡ Auto-Balance to ${formatCurrency(sim.recommendedPaycheckSavings)}/${cadence}
          </button>
        </div>
      `;
      DOM.crunchNextAmount.textContent = formatCurrency(next ? next.amount : 0);
      DOM.crunchPaceLabel.textContent = `Safe Pace Needed`;
      DOM.crunchNextPace.textContent = `${formatCurrency(sim.recommendedPaycheckSavings)}/${cadence}`;
      DOM.crunchNextPace.className = 'crunch-stat-value highlight';
      DOM.chartStatusPill.textContent = 'Deficit Risk';
      DOM.chartStatusPill.className = 'badge-pill badge-overdue';

      const fixBtn = document.getElementById('bannerFixDeficitBtn');
      if (fixBtn) {
        fixBtn.addEventListener('click', () => {
          state.plannedSavingsPerPaycheck = sim.recommendedPaycheckSavings;
          DOM.simPlannedSavings.value = sim.recommendedPaycheckSavings;
          saveState();
          showToast(`Pace optimized to ${formatCurrency(sim.recommendedPaycheckSavings)}/${cadence}!`, '⚡');
          renderAll();
        });
      }
    } else {
      banner.className = 'crunch-banner';
      DOM.crunchBannerIcon.textContent = '✨';
      DOM.crunchBannerTitle.textContent = next 
        ? `Upcoming Payment: ${next.title} (${formatDate(next.dueDate)})`
        : 'All Milestones on Schedule';
      
      const bottleneck = data.bottleneckMilestone;
      if (bottleneck && bottleneck.requiredRate.perPaycheck > state.plannedSavingsPerPaycheck) {
        DOM.crunchBannerText.innerHTML = `
          Your next bill is <strong>${formatCurrency(next.amount)}</strong> for <em>${next.vendor}</em>. 
          Milestone <strong>"${bottleneck.title}"</strong> due ${formatDate(bottleneck.dueDate)} requires a peak savings pace of 
          <strong>${formatCurrency(bottleneck.requiredRate.perPaycheck)}/${cadence}</strong>.
        `;
      } else {
        DOM.crunchBannerText.innerHTML = `
          Your next payment of <strong>${formatCurrency(next.amount)}</strong> is due in 
          <strong>${next.daysRemaining} days</strong> (${next.vendor}). Your cash flow plan is <strong>Healthy & On Track</strong>!
        `;
      }

      DOM.crunchNextAmount.textContent = formatCurrency(next ? next.amount : 0);
      DOM.crunchPaceLabel.textContent = `Your Pace`;
      DOM.crunchNextPace.textContent = `${formatCurrency(state.plannedSavingsPerPaycheck)}/${cadence}`;
      DOM.crunchNextPace.className = 'crunch-stat-value';
      DOM.chartStatusPill.textContent = 'On Track';
      DOM.chartStatusPill.className = 'badge-pill badge-upcoming';
    }
  }

  function renderKpiCards(data) {
    // 1. Estimated Total vs Target Budget
    if (state.hasTargetBudget && data.targetBudget > 0) {
      if (DOM.kpiBudgetTitle) DOM.kpiBudgetTitle.textContent = 'Budget Goal';
      if (DOM.kpiBudgetIcon) DOM.kpiBudgetIcon.textContent = '🎯';
      DOM.kpiTargetBudget.textContent = formatCurrency(data.targetBudget);
      const budgetDiff = data.totalEstimated - data.targetBudget;
      if (budgetDiff > 0) {
        DOM.kpiBudgetDiff.innerHTML = `<span style="color: var(--danger-primary);">$${budgetDiff.toLocaleString()} over goal</span>`;
      } else if (budgetDiff < 0) {
        DOM.kpiBudgetDiff.innerHTML = `<span style="color: var(--sage-primary);">$${Math.abs(budgetDiff).toLocaleString()} under goal</span>`;
      } else {
        DOM.kpiBudgetDiff.textContent = 'Exactly on budget goal';
      }
      const budgetPct = Math.min(100, Math.round((data.totalEstimated / data.targetBudget) * 100));
      DOM.kpiBudgetBar.style.width = `${budgetPct}%`;
    } else {
      if (DOM.kpiBudgetTitle) DOM.kpiBudgetTitle.textContent = 'Total Estimated Cost';
      if (DOM.kpiBudgetIcon) DOM.kpiBudgetIcon.textContent = '📊';
      DOM.kpiTargetBudget.textContent = formatCurrency(data.totalEstimated);
      DOM.kpiBudgetDiff.innerHTML = `Sum of ${state.expenses.length} estimated items • <button type="button" class="btn-link-action" id="kpiSetBudgetBtn">Set goal</button>`;
      DOM.kpiBudgetBar.style.width = state.expenses.length > 0 ? '100%' : '0%';

      const setGoalBtn = document.getElementById('kpiSetBudgetBtn');
      if (setGoalBtn) {
        setGoalBtn.onclick = (e) => {
          e.preventDefault();
          openSettingsModal();
        };
      }
    }

    // 2. Actual Total
    DOM.kpiActualCost.textContent = formatCurrency(data.totalActual);
    DOM.kpiAllocatedMeta.textContent = `Estimated: ${formatCurrency(data.totalEstimated)}`;
    DOM.kpiActualBar.style.width = data.totalActual > 0 ? '100%' : '0%';

    // 3. Paid So Far
    DOM.kpiPaidSoFar.textContent = formatCurrency(data.totalPaid);
    const paidPct = data.totalActual > 0 ? Math.min(100, Math.round((data.totalPaid / data.totalActual) * 100)) : 0;
    DOM.kpiPaidPct.textContent = `${paidPct}% of wedding costs paid`;
    DOM.kpiPaidBar.style.width = `${paidPct}%`;

    // 4. Remaining Balance Due
    DOM.kpiRemainingDue.textContent = formatCurrency(data.totalRemainingDue);
    DOM.kpiUpcomingCount.textContent = `${data.unpaid.length} payments upcoming`;
    const remainPct = data.totalActual > 0 ? Math.min(100, Math.round((data.totalRemainingDue / data.totalActual) * 100)) : 0;
    DOM.kpiRemainingBar.style.width = `${remainPct}%`;

    // 5. Current Savings Pool
    DOM.kpiCurrentSavings.textContent = formatCurrency(data.currentSavings);
    if (data.totalRemainingDue === 0) {
      DOM.kpiSavingsGap.innerHTML = `<span style="color: var(--text-muted);">$0 balance to cover</span>`;
      DOM.kpiSavingsCoverageBar.style.width = '0%';
    } else if (data.netGapToWedding <= 0) {
      DOM.kpiSavingsGap.innerHTML = `<span style="color: var(--sage-primary);">100% of remaining bills covered!</span>`;
      DOM.kpiSavingsCoverageBar.style.width = '100%';
    } else {
      DOM.kpiSavingsGap.textContent = `Net savings to go: ${formatCurrency(data.netGapToWedding)}`;
      const coveragePct = data.totalRemainingDue > 0 ? Math.min(100, Math.round((data.currentSavings / data.totalRemainingDue) * 100)) : 0;
      DOM.kpiSavingsCoverageBar.style.width = `${coveragePct}%`;
    }
  }

  function renderVelocitySection(data) {
    DOM.ratePerDay.textContent = formatCurrency(data.velocity.perDay);
    DOM.ratePerWeek.textContent = formatCurrency(data.velocity.perWeek);
    DOM.ratePerPaycheck.textContent = formatCurrency(data.velocity.perPaycheck);
    DOM.ratePerMonth.textContent = formatCurrency(data.velocity.perMonth);

    // Active cadence highlight
    Object.values(DOM.rateBoxes).forEach(box => box.classList.remove('active-cadence'));
    if (state.paycheckCadence === 'weekly') DOM.rateBoxes.week.classList.add('active-cadence');
    else if (state.paycheckCadence === 'monthly') DOM.rateBoxes.month.classList.add('active-cadence');
    else DOM.rateBoxes.paycheck.classList.add('active-cadence');

    if (!state.weddingDate && data.totalEstimated === 0) {
      DOM.velocityAdviceText.innerHTML = `
        Your planner is currently a blank slate. Start by setting your wedding date in 
        <button type="button" class="btn-link-action" id="velOpenSettingsBtn">Settings</button> 
        and clicking <strong>+ Add Expense</strong> above.
      `;
      const btn = document.getElementById('velOpenSettingsBtn');
      if (btn) btn.onclick = openSettingsModal;
      return;
    }

    if (!state.weddingDate && data.totalEstimated > 0) {
      DOM.velocityAdviceText.innerHTML = `
        You have <strong>${formatCurrency(data.totalEstimated)}</strong> in estimated expenses. 
        Set your wedding date in <button type="button" class="btn-link-action" id="velOpenSettingsBtn">Settings</button> 
        to calculate required daily and paycheck savings targets.
      `;
      const btn = document.getElementById('velOpenSettingsBtn');
      if (btn) btn.onclick = openSettingsModal;
      return;
    }

    if (state.weddingDate && data.totalEstimated === 0) {
      DOM.velocityAdviceText.innerHTML = `
        Your wedding is scheduled for <strong>${formatDate(state.weddingDate)}</strong> (${data.daysToWedding} days away). 
        Click <strong>+ Add Expense</strong> to begin adding items and calculating your required savings pace.
      `;
      return;
    }

    if (data.netGapToWedding <= 0) {
      DOM.velocityAdviceText.innerHTML = `
        🎉 <strong>Your wedding costs are 100% covered!</strong> Your savings pool covers all remaining unpaid expenses.
      `;
      return;
    }

    DOM.velocityAdviceText.innerHTML = `
      To cover your <strong>${formatCurrency(data.netGapToWedding)}</strong> net balance 
      over the remaining <strong>${data.daysToWedding} days</strong> (${data.paychecksToWedding.toFixed(1)} ${getCadenceName(state.paycheckCadence).toLowerCase()} paychecks),
      you must save <strong>${formatCurrency(data.velocity.perPaycheck)}</strong> per cadence.
    `;
  }

  function renderDashboardMilestones(data) {
    const list = DOM.dashboardMilestonesList;
    list.innerHTML = '';

    if (data.milestones.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 36px 20px; color: var(--text-muted);">
          <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">📋</span>
          <p style="font-size: 0.95rem; margin-bottom: 14px;">No upcoming payments scheduled yet.</p>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('openAddExpenseBtn').click()">
            <span>+</span> Add Expense & Milestones
          </button>
        </div>
      `;
      return;
    }

    const nextThree = data.unpaid.slice(0, 4);

    if (nextThree.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <span style="font-size: 2rem;">💐</span>
          <p style="margin-top: 8px;">No pending payments! All milestones have been marked as paid.</p>
        </div>
      `;
      return;
    }

    nextThree.forEach(m => {
      const card = createMilestoneCardElement(m, true);
      list.appendChild(card);
    });
  }

  function renderFullSchedule(data) {
    const list = DOM.fullTimelineList;
    list.innerHTML = '';

    if (data.milestones.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 10px;">📅</span>
          <h4 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--text-main); margin-bottom: 6px;">Your Payment Schedule is Clear</h4>
          <p style="font-size: 0.95rem; margin-bottom: 16px;">Add vendor expenses with installment dates to see your complete chronological payment timeline here.</p>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('openAddExpenseBtn').click()">
            <span>+</span> Add Payment Milestone
          </button>
        </div>
      `;
      return;
    }

    let items = data.milestones;

    // Apply Filter
    if (scheduleFilter === 'all-unpaid') {
      items = items.filter(m => !m.isPaid);
    } else if (scheduleFilter === 'next-30') {
      items = items.filter(m => !m.isPaid && m.daysRemaining >= 0 && m.daysRemaining <= 30);
    } else if (scheduleFilter === 'next-60') {
      items = items.filter(m => !m.isPaid && m.daysRemaining >= 0 && m.daysRemaining <= 60);
    } else if (scheduleFilter === 'overdue') {
      items = items.filter(m => !m.isPaid && m.daysRemaining < 0);
    } else if (scheduleFilter === 'paid') {
      items = items.filter(m => m.isPaid);
    }

    if (items.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <span style="font-size: 2.2rem;">✨</span>
          <p style="margin-top: 10px; font-size: 1rem;">No payments found for this filter criteria.</p>
        </div>
      `;
      return;
    }

    items.forEach(m => {
      const card = createMilestoneCardElement(m, false);
      list.appendChild(card);
    });
  }

  function createMilestoneCardElement(m, isDashboard) {
    const card = document.createElement('div');
    const isPaid = m.isPaid;
    const isOverdue = !isPaid && m.daysRemaining < 0;
    const isDueSoon = !isPaid && m.daysRemaining >= 0 && m.daysRemaining <= 14;

    let statusClass = 'status-upcoming';
    let badgeClass = 'badge-upcoming';
    let badgeLabel = `${m.daysRemaining} days left`;

    if (isPaid) {
      statusClass = 'status-paid';
      badgeClass = 'badge-paid';
      badgeLabel = 'Paid';
    } else if (isOverdue) {
      statusClass = 'status-overdue';
      badgeClass = 'badge-overdue';
      badgeLabel = `${Math.abs(m.daysRemaining)} days overdue`;
    } else if (isDueSoon) {
      statusClass = 'status-duesoon';
      badgeClass = 'badge-duesoon';
      badgeLabel = m.daysRemaining === 0 ? 'Due Today' : `Due in ${m.daysRemaining}d`;
    }

    card.className = `timeline-card ${statusClass}`;

    // Split date into parts
    let monthStr = '---';
    let dayStr = '--';
    let yearStr = '----';
    if (m.dueDate) {
      const parts = m.dueDate.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        monthStr = d.toLocaleDateString('en-US', { month: 'short' });
        dayStr = parts[2];
        yearStr = parts[0];
      }
    }

    const cadenceName = getCadenceName(state.paycheckCadence);
    const paceAmount = m.requiredRate ? formatCurrency(m.requiredRate.perPaycheck) : '$0';

    card.innerHTML = `
      <div class="timeline-date-badge">
        <span class="date-month">${monthStr}</span>
        <span class="date-day">${dayStr}</span>
        <span class="date-year">${yearStr}</span>
      </div>

      <div class="timeline-info">
        <div class="timeline-title-row">
          <span class="milestone-name">${escapeHtml(m.title)}</span>
          <span class="timeline-days-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="vendor-label">
          <span>${escapeHtml(m.expenseName)}</span> • <span style="font-weight: 500;">${escapeHtml(m.vendor)}</span>
        </div>
        ${!isPaid && m.requiredRate ? `
          <div class="timeline-savings-pace">
            ${m.netSavingsNeededByDate === 0 
              ? `<span style="color: var(--sage-primary); font-weight: 600;">✅ Fully covered by current bank savings pool</span>`
              : `<span>Required savings pace: <strong>${paceAmount} / ${cadenceName}</strong> (${formatCurrency(m.netSavingsNeededByDate)} new savings needed)</span>`
            }
          </div>
        ` : ''}
      </div>

      <div class="timeline-amount-col">
        <div class="milestone-amount">${formatCurrency(m.amount)}</div>
        ${!isPaid && m.cumulativeUnpaidDue ? `
          <div class="cumulative-due-sub">Total due by date: ${formatCurrency(m.cumulativeUnpaidDue)}</div>
        ` : ''}
      </div>

      <div class="timeline-actions">
        ${!isPaid ? `
          <button class="btn btn-success btn-sm mark-paid-btn" data-exp-id="${m.expenseId}" data-milestone-id="${m.milestoneId}" title="Mark this milestone paid">
            ✓ Mark Paid
          </button>
        ` : `
          <button class="btn btn-secondary btn-sm mark-unpaid-btn" data-exp-id="${m.expenseId}" data-milestone-id="${m.milestoneId}" title="Revert to unpaid">
            ↩ Undo
          </button>
        `}
      </div>
    `;

    return card;
  }

  function renderBudgetManager(data) {
    // Populate real-time Estimated Summary Banner
    if (DOM.summaryTotalEstimated) DOM.summaryTotalEstimated.textContent = formatCurrency(data.totalEstimated);
    if (DOM.summaryItemCount) DOM.summaryItemCount.textContent = `Across ${state.expenses.length} item${state.expenses.length === 1 ? '' : 's'}`;
    if (DOM.summaryTotalActual) DOM.summaryTotalActual.textContent = formatCurrency(data.totalActual);
    if (DOM.summaryTargetBudget) {
      if (state.hasTargetBudget && data.targetBudget > 0) {
        DOM.summaryTargetBudget.textContent = formatCurrency(data.targetBudget);
        DOM.summaryTargetBudget.style.fontSize = '1.65rem';
        if (DOM.toggleBudgetModeInlineBtn) DOM.toggleBudgetModeInlineBtn.textContent = '⚙️ Edit Goal';
      } else {
        DOM.summaryTargetBudget.textContent = 'None (Bottom-Up)';
        DOM.summaryTargetBudget.style.fontSize = '1.25rem';
        if (DOM.toggleBudgetModeInlineBtn) DOM.toggleBudgetModeInlineBtn.textContent = '➕ Set Optional Goal';
      }
    }

    const container = DOM.budgetCategoryGroupsContainer;
    container.innerHTML = '';

    if (state.expenses.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 24px; background: white; border-radius: 12px; border: 1px dashed var(--border-color); margin-top: 16px;">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 10px;">📋</span>
          <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--text-main); margin-bottom: 6px;">Your Wedding Planner is a Blank Slate</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 480px; margin: 0 auto 18px auto;">
            Add your estimated wedding items (venue, catering, attire, photography, etc.). The app will automatically sum your estimated costs and calculate required savings by your payment due dates.
          </p>
          <button class="btn btn-primary" onclick="document.getElementById('openAddExpenseBtn').click()">
            <span>+</span> Add Your First Expense
          </button>
        </div>
      `;
    }

    DEFAULT_CATEGORIES.forEach(category => {
      const categoryExpenses = state.expenses.filter(exp => exp.categoryId === category.id);
      if (categoryExpenses.length === 0) return; // Only show non-empty or create placeholder

      const groupDiv = document.createElement('div');
      groupDiv.className = 'expense-category-group';
      groupDiv.id = `catGroup-${category.id}`;

      let catEstimated = 0;
      let catActual = 0;
      let catPaid = 0;

      categoryExpenses.forEach(exp => {
        catEstimated += Number(exp.estimatedCost) || 0;
        catActual += Number(exp.actualCost) || 0;
        if (exp.milestones) {
          exp.milestones.forEach(m => {
            if (m.isPaid) catPaid += Number(m.amount) || 0;
          });
        }
      });

      const catRemaining = catActual - catPaid;

      groupDiv.innerHTML = `
        <div class="category-header-row" data-cat-id="${category.id}">
          <div class="cat-title-left">
            <span class="cat-icon-badge">${category.icon}</span>
            <div>
              <div class="cat-name">${escapeHtml(category.name)}</div>
              <div class="cat-items-count">${categoryExpenses.length} vendor${categoryExpenses.length === 1 ? '' : 's'}</div>
            </div>
          </div>

          <div class="cat-totals-right">
            <div class="cat-stat-block">
              <div class="cat-stat-label">Estimated</div>
              <div class="cat-stat-num">${formatCurrency(catEstimated)}</div>
            </div>
            <div class="cat-stat-block">
              <div class="cat-stat-label">Actual</div>
              <div class="cat-stat-num">${formatCurrency(catActual)}</div>
            </div>
            <div class="cat-stat-block">
              <div class="cat-stat-label">Paid</div>
              <div class="cat-stat-num" style="color: var(--sage-primary);">${formatCurrency(catPaid)}</div>
            </div>
            <div class="cat-stat-block">
              <div class="cat-stat-label">Remaining</div>
              <div class="cat-stat-num cost-remaining">${formatCurrency(catRemaining)}</div>
            </div>
            <span class="cat-chevron">▼</span>
          </div>
        </div>

        <div class="category-items-list" id="catList-${category.id}">
          ${categoryExpenses.map(exp => {
            const expPaid = (exp.milestones || []).filter(m => m.isPaid).reduce((s, m) => s + m.amount, 0);
            const expRemain = exp.actualCost - expPaid;
            const milestoneSummary = (exp.milestones || []).map(m => `
              <span>• ${escapeHtml(m.title)}: ${formatCurrency(m.amount)} (${formatDate(m.dueDate)}) ${m.isPaid ? '✅' : '⏳'}</span>
            `).join('');

            return `
              <div class="expense-item-row" data-expense-id="${exp.id}">
                <div class="item-name-vendor">
                  <h4>${escapeHtml(exp.name)}</h4>
                  <p>${escapeHtml(exp.vendor || 'No vendor specified')}</p>
                </div>
                <div>
                  <div class="cat-stat-label">Estimated</div>
                  <div class="cell-cost">${formatCurrency(exp.estimatedCost)}</div>
                </div>
                <div>
                  <div class="cat-stat-label">Actual</div>
                  <div class="cell-cost">${formatCurrency(exp.actualCost)}</div>
                </div>
                <div>
                  <div class="cat-stat-label">Remaining</div>
                  <div class="cell-cost cost-remaining">${formatCurrency(expRemain)}</div>
                </div>
                <div class="milestones-summary-pill">
                  ${milestoneSummary || '<span style="color: var(--text-light);">No payment milestones set</span>'}
                </div>
                <div class="item-row-actions">
                  <button class="btn btn-secondary btn-sm edit-expense-btn" data-exp-id="${exp.id}" title="Edit Expense">
                    ✏️ Edit
                  </button>
                  <button class="btn btn-danger btn-sm delete-expense-btn" data-exp-id="${exp.id}" title="Delete Expense">
                    🗑️
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      container.appendChild(groupDiv);
    });

    // Render Category Legend List for the chart panel
    const legendList = DOM.categoryLegendList;
    legendList.innerHTML = '';
    const hasExpenses = state.expenses.length > 0;
    if (!hasExpenses) {
      legendList.innerHTML = `
        <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
          Category breakdown will appear here once you add expenses.
        </div>
      `;
    } else {
      DEFAULT_CATEGORIES.forEach(cat => {
        const expenses = state.expenses.filter(e => e.categoryId === cat.id);
        if (expenses.length === 0) return;
        const total = expenses.reduce((s, e) => s + Number(e.actualCost || 0), 0);
        const pct = data.totalActual > 0 ? Math.round((total / data.totalActual) * 100) : 0;

        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
          <div class="legend-left">
            <span class="legend-color-dot" style="background: ${cat.color};"></span>
            <span>${cat.icon} ${escapeHtml(cat.name)}</span>
          </div>
          <span style="font-weight: 700;">${formatCurrency(total)} (${pct}%)</span>
        `;
        legendList.appendChild(item);
      });
    }
  }

  function renderSimulator(data) {
    DOM.simCurrentSavings.value = state.currentSavings;
    DOM.simPaycheckCadence.value = state.paycheckCadence;
    DOM.simPlannedSavings.value = state.plannedSavingsPerPaycheck;
    DOM.simSafetyCushion.value = state.safetyCushion;

    const sim = data.simulation;
    const banner = DOM.simStatusBanner;
    const icon = DOM.simStatusIcon;
    const heading = DOM.simStatusHeading;
    const detail = DOM.simStatusDetail;
    const cadence = getCadenceName(state.paycheckCadence);

    const tbody = DOM.simBreakdownBody;
    tbody.innerHTML = '';

    if (sim.timelineSteps.length === 0) {
      banner.className = 'sim-status-banner';
      banner.style.background = 'rgba(197, 160, 89, 0.08)';
      banner.style.borderColor = 'rgba(197, 160, 89, 0.3)';
      icon.textContent = '💡';
      heading.textContent = 'Cash Flow Simulator Ready';
      detail.innerHTML = `
        Add expenses with payment milestones to simulate and verify your cashflow balance over time.
      `;
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No upcoming payments to simulate. Add your expenses to run cashflow simulations.</td></tr>`;
      return;
    }

    if (sim.hasDeficit) {
      banner.className = 'sim-status-banner red';
      banner.style.background = '';
      banner.style.borderColor = '';
      icon.textContent = '⚠️';
      heading.textContent = 'Cash Shortfall Detected!';
      detail.innerHTML = `
        At your current planned savings rate of <strong>${formatCurrency(state.plannedSavingsPerPaycheck)} / ${cadence}</strong>, 
        your wedding account will dip <strong>${formatCurrency(sim.deficitAmount)} below your safety cushion</strong> 
        by <strong>${formatDate(sim.deficitDate)}</strong>! Click <strong>"Auto-Balance Savings Pace"</strong> to fix this instantly.
      `;
    } else {
      banner.className = 'sim-status-banner green';
      banner.style.background = '';
      banner.style.borderColor = '';
      icon.textContent = '✅';
      heading.textContent = 'Healthy & Stress-Free Cashflow Plan';
      detail.innerHTML = `
        At your pace of <strong>${formatCurrency(state.plannedSavingsPerPaycheck)} / ${cadence}</strong>, 
        your projected cash reserves never fall below your ${formatCurrency(state.safetyCushion)} cushion! 
        Minimum cushion reached will be <strong>${formatCurrency(sim.minBalance)}</strong>.
      `;
    }

    sim.timelineSteps.forEach(step => {
      const tr = document.createElement('tr');
      const isDeficit = step.isDeficit;
      const balanceClass = isDeficit ? 'balance-negative' : 'balance-positive';
      const statusText = isDeficit 
        ? `<span class="badge-pill badge-overdue">Deficit (-${formatCurrency(state.safetyCushion - step.projectedBalance)})</span>`
        : `<span class="badge-pill badge-paid">Safe Cushion</span>`;

      tr.innerHTML = `
        <td><strong>${formatDate(step.milestone.dueDate)}</strong></td>
        <td>${escapeHtml(step.milestone.title)}</td>
        <td>${escapeHtml(step.milestone.vendor)}</td>
        <td style="font-weight: 600;">${formatCurrency(step.milestone.amount)}</td>
        <td class="${balanceClass}">${formatCurrency(step.projectedBalance)}</td>
        <td>${statusText}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // =========================================================================
  // CANVAS CHARTS (HIGH-DPI)
  // =========================================================================
  function renderCharts(data) {
    renderCashflowChart(data);
    renderCategoryDonutChart(data);
  }

  function setupCanvasDPI(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  }

  function renderCashflowChart(data) {
    const canvas = DOM.cashflowCanvas;
    if (!canvas || !canvas.parentElement) return;

    const { ctx, width, height } = setupCanvasDPI(canvas);
    ctx.clearRect(0, 0, width, height);

    const steps = data.simulation.timelineSteps;
    if (steps.length === 0) {
      ctx.fillStyle = '#6E6862';
      ctx.font = '14px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('No upcoming payment milestones to chart', width / 2, height / 2);
      return;
    }

    const padLeft = 60;
    const padRight = 30;
    const padTop = 20;
    const padBottom = 40;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Determine scale
    let maxVal = Math.max(
      data.totalActual,
      data.currentSavings + (steps[steps.length - 1].paychecksReceived * state.plannedSavingsPerPaycheck),
      ...steps.map(s => s.projectedBalance)
    );
    let minVal = Math.min(0, ...steps.map(s => s.projectedBalance));
    maxVal = Math.ceil((maxVal * 1.15) / 1000) * 1000;
    if (minVal < 0) minVal = Math.floor((minVal * 1.2) / 1000) * 1000;

    const valRange = maxVal - minVal || 1;

    function getY(val) {
      return padTop + chartH - ((val - minVal) / valRange) * chartH;
    }

    function getX(index, total) {
      if (total <= 1) return padLeft + chartW / 2;
      return padLeft + (index / (total - 1)) * chartW;
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(60, 50, 40, 0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#989189';
    ctx.font = '11px Plus Jakarta Sans';
    ctx.textAlign = 'right';

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const v = minVal + (valRange / gridSteps) * i;
      const y = getY(v);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
      ctx.fillText('$' + Math.round(v).toLocaleString(), padLeft - 8, y + 4);
    }

    // Zero / Baseline if applicable
    if (minVal < 0) {
      const zeroY = getY(0);
      ctx.strokeStyle = 'rgba(192, 57, 43, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padLeft, zeroY);
      ctx.lineTo(width - padRight, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Line 1: Cumulative Payments Due (Rose/Red)
    ctx.strokeStyle = '#C4797D';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    steps.forEach((s, idx) => {
      const x = getX(idx, steps.length);
      const y = getY(s.cumulativeDue);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Line 2: Projected Savings Balance (Gold/Champagne)
    ctx.strokeStyle = '#C5A059';
    ctx.lineWidth = 3;
    ctx.beginPath();
    steps.forEach((s, idx) => {
      const x = getX(idx, steps.length);
      const y = getY(s.projectedBalance);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Data points & markers
    steps.forEach((s, idx) => {
      const x = getX(idx, steps.length);
      const y = getY(s.projectedBalance);

      ctx.fillStyle = s.isDeficit ? '#C0392B' : '#C5A059';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // X-Axis date labels
      ctx.fillStyle = '#6E6862';
      ctx.font = '10px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      if (idx === 0 || idx === steps.length - 1 || idx % Math.ceil(steps.length / 5) === 0) {
        const parts = s.milestone.dueDate.split('-');
        const dateLabel = parts.length === 3 ? `${parts[1]}/${parts[2]}` : s.milestone.dueDate;
        ctx.fillText(dateLabel, x, height - padBottom + 18);
      }
    });
  }

  function renderCategoryDonutChart(data) {
    const canvas = DOM.categoryDonutCanvas;
    if (!canvas || !canvas.parentElement) return;

    const { ctx, width, height } = setupCanvasDPI(canvas);
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) - 10;
    const innerRadius = outerRadius * 0.65;

    let total = 0;
    const slices = [];
    DEFAULT_CATEGORIES.forEach(cat => {
      const expenses = state.expenses.filter(e => e.categoryId === cat.id);
      const catSum = expenses.reduce((s, e) => s + Number(e.actualCost || 0), 0);
      if (catSum > 0) {
        slices.push({ cat, amount: catSum });
        total += catSum;
      }
    });

    if (total === 0) {
      ctx.fillStyle = '#989189';
      ctx.font = '13px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('No expenses allocated', centerX, centerY);
      return;
    }

    let startAngle = -Math.PI / 2;
    slices.forEach(slice => {
      const sliceAngle = (slice.amount / total) * Math.PI * 2;
      ctx.fillStyle = slice.cat.color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center hole text
    ctx.fillStyle = '#242220';
    ctx.font = 'bold 15px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatCurrency(total), centerX, centerY - 6);
    ctx.fillStyle = '#6E6862';
    ctx.font = '10px Plus Jakarta Sans';
    ctx.fillText('Total Actual', centerX, centerY + 12);
  }

  // =========================================================================
  // MODAL CONTROLLERS & FORM HANDLERS
  // =========================================================================
  function populateCategorySelect() {
    DOM.expenseCategory.innerHTML = DEFAULT_CATEGORIES.map(c => `
      <option value="${c.id}">${c.icon} ${c.name}</option>
    `).join('');
  }

  function openExpenseModal(expenseToEdit = null) {
    DOM.modalMilestonesContainer.innerHTML = '';

    if (expenseToEdit) {
      DOM.modalTitle.textContent = 'Edit Wedding Expense';
      DOM.editExpenseId.value = expenseToEdit.id;
      DOM.expenseCategory.value = expenseToEdit.categoryId;
      DOM.expenseName.value = expenseToEdit.name;
      DOM.expenseVendor.value = expenseToEdit.vendor || '';
      DOM.expenseEstimatedCost.value = expenseToEdit.estimatedCost || 0;
      DOM.expenseActualCost.value = expenseToEdit.actualCost || 0;
      DOM.expenseNotes.value = expenseToEdit.notes || '';

      if (expenseToEdit.milestones && expenseToEdit.milestones.length > 0) {
        expenseToEdit.milestones.forEach(m => addMilestoneInputRow(m));
      } else {
        addMilestoneInputRow({ title: 'Full Payment on Wedding Day', amount: expenseToEdit.actualCost || expenseToEdit.estimatedCost, dueDate: state.weddingDate, isPaid: false });
      }
    } else {
      DOM.modalTitle.textContent = 'Add Wedding Expense';
      DOM.editExpenseId.value = '';
      DOM.expenseForm.reset();
      DOM.expenseEstimatedCost.value = '';
      DOM.expenseActualCost.value = '';
      // Pre-add 1 convenient default payment milestone due on wedding day
      addMilestoneInputRow({ title: 'Full Payment on Wedding Day', amount: '', dueDate: state.weddingDate, isPaid: false });
    }

    DOM.expenseModal.showModal();
  }

  function addMilestoneInputRow(m = { title: '', amount: '', dueDate: '', isPaid: false }) {
    const row = document.createElement('div');
    row.className = 'milestone-input-row';
    const amountVal = (m.amount !== undefined && m.amount !== null && m.amount !== 0) ? m.amount : '';
    const dateVal = m.dueDate || state.weddingDate || '';
    row.innerHTML = `
      <input type="text" class="form-control m-title" placeholder="e.g. Full Payment or Deposit" value="${escapeHtml(m.title || 'Payment Due')}">
      <input type="number" class="form-control m-amount" placeholder="Amount ($)" min="0" step="10" value="${amountVal}">
      <input type="date" class="form-control m-date" value="${dateVal}">
      <label style="font-size: 0.76rem; display: flex; align-items: center; gap: 4px; cursor: pointer; white-space: nowrap;">
        <input type="checkbox" class="m-paid" ${m.isPaid ? 'checked' : ''}> Paid
      </label>
      <button type="button" class="btn btn-text btn-sm remove-m-row-btn" style="color: var(--danger-primary);" title="Remove milestone">✕</button>
    `;

    row.querySelector('.remove-m-row-btn').addEventListener('click', () => {
      row.remove();
    });

    DOM.modalMilestonesContainer.appendChild(row);
  }

  function handleSaveExpense(e) {
    e.preventDefault();

    const id = DOM.editExpenseId.value || 'exp-' + Date.now();
    const categoryId = DOM.expenseCategory.value;
    const name = DOM.expenseName.value.trim();
    const vendor = DOM.expenseVendor.value.trim();
    const estimatedCost = Number(DOM.expenseEstimatedCost.value) || 0;
    let actualCost = Number(DOM.expenseActualCost.value) || 0;
    // If actual cost is not specified, default to estimated cost
    if (actualCost <= 0) {
      actualCost = estimatedCost;
    }
    const notes = DOM.expenseNotes.value.trim();

    // Harvest milestones
    const rows = DOM.modalMilestonesContainer.querySelectorAll('.milestone-input-row');
    const milestones = [];

    rows.forEach((row, idx) => {
      const title = row.querySelector('.m-title').value.trim() || `Milestone ${idx + 1}`;
      let amount = Number(row.querySelector('.m-amount').value) || 0;
      let dueDate = row.querySelector('.m-date').value || state.weddingDate;
      const isPaid = row.querySelector('.m-paid').checked;

      // If user kept a single milestone row but left amount blank, auto-assign full cost
      if (rows.length === 1 && amount <= 0) {
        amount = actualCost;
      }

      if (amount > 0) {
        milestones.push({
          id: `m-${id}-${idx}-${Date.now()}`,
          title,
          amount,
          dueDate,
          isPaid,
          paidDate: isPaid ? (new Date().toISOString().split('T')[0]) : null
        });
      }
    });

    // If no milestone rows were created or all were empty, auto-create a single milestone due on wedding date
    if (milestones.length === 0 && actualCost > 0) {
      milestones.push({
        id: `m-${id}-0-${Date.now()}`,
        title: 'Full Payment on Wedding Day',
        amount: actualCost,
        dueDate: state.weddingDate,
        isPaid: false,
        paidDate: null
      });
    }

    const expenseObj = {
      id,
      categoryId,
      name,
      vendor,
      estimatedCost,
      actualCost,
      notes,
      milestones
    };

    const existingIndex = state.expenses.findIndex(exp => exp.id === id);
    if (existingIndex >= 0) {
      state.expenses[existingIndex] = expenseObj;
      showToast(`Updated "${name}"`, '✏️');
    } else {
      state.expenses.push(expenseObj);
      showToast(`Added "${name}" to wedding estimates`, '✨');
    }

    saveState();
    DOM.expenseModal.close();
    renderAll();
  }

  function openSettingsModal() {
    DOM.setCoupleNames.value = state.coupleNames;
    DOM.setWeddingDate.value = state.weddingDate;
    if (DOM.setHasTargetBudget) {
      DOM.setHasTargetBudget.checked = Boolean(state.hasTargetBudget);
    }
    if (DOM.targetBudgetInputWrapper) {
      DOM.targetBudgetInputWrapper.style.display = state.hasTargetBudget ? 'block' : 'none';
    }
    DOM.setTargetBudget.value = state.targetBudget || '';
    DOM.setCurrentSavings.value = state.currentSavings;
    DOM.setPaycheckCadence.value = state.paycheckCadence;
    DOM.setPlannedPaycheck.value = state.plannedSavingsPerPaycheck;
    DOM.setSafetyCushion.value = state.safetyCushion;
    DOM.settingsModal.showModal();
  }

  function handleSaveSettings(e) {
    e.preventDefault();

    state.coupleNames = DOM.setCoupleNames.value.trim();
    state.weddingDate = DOM.setWeddingDate.value;
    state.hasTargetBudget = DOM.setHasTargetBudget ? DOM.setHasTargetBudget.checked : false;
    state.targetBudget = state.hasTargetBudget ? (Number(DOM.setTargetBudget.value) || 0) : 0;
    state.currentSavings = Number(DOM.setCurrentSavings.value) || 0;
    state.paycheckCadence = DOM.setPaycheckCadence.value;
    state.plannedSavingsPerPaycheck = Number(DOM.setPlannedPaycheck.value) || 0;
    state.safetyCushion = Number(DOM.setSafetyCushion.value) || 0;

    saveState();
    DOM.settingsModal.close();
    showToast(state.hasTargetBudget ? `Target budget set to ${formatCurrency(state.targetBudget)}` : 'Budget mode: Bottom-up estimated total', '⚙️');
    renderAll();
  }

  // =========================================================================
  // ACTIONS & EVENT LISTENERS
  // =========================================================================
  function setupEventListeners() {
    // Tab switching
    DOM.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
      });
    });

    // Schedule Filter Chips
    document.querySelectorAll('[data-schedule-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-schedule-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        scheduleFilter = btn.dataset.scheduleFilter;
        renderFullSchedule(calculateFinancialAnalytics());
      });
    });

    // Modal Triggers
    DOM.openAddExpenseBtn.addEventListener('click', () => openExpenseModal());
    DOM.addExpenseFromScheduleBtn.addEventListener('click', () => openExpenseModal());
    DOM.addExpenseFromBudgetBtn.addEventListener('click', () => openExpenseModal());
    DOM.closeExpenseModalBtn.addEventListener('click', () => DOM.expenseModal.close());
    DOM.cancelExpenseModalBtn.addEventListener('click', () => DOM.expenseModal.close());
    DOM.addMilestoneRowBtn.addEventListener('click', () => addMilestoneInputRow());
    DOM.expenseForm.addEventListener('submit', handleSaveExpense);

    DOM.openSettingsBtn.addEventListener('click', openSettingsModal);
    DOM.closeSettingsModalBtn.addEventListener('click', () => DOM.settingsModal.close());
    DOM.cancelSettingsModalBtn.addEventListener('click', () => DOM.settingsModal.close());
    DOM.settingsForm.addEventListener('submit', handleSaveSettings);

    // Target budget toggle in settings modal
    if (DOM.setHasTargetBudget && DOM.targetBudgetInputWrapper) {
      DOM.setHasTargetBudget.addEventListener('change', () => {
        DOM.targetBudgetInputWrapper.style.display = DOM.setHasTargetBudget.checked ? 'block' : 'none';
        if (DOM.setHasTargetBudget.checked && DOM.setTargetBudget) {
          DOM.setTargetBudget.focus();
        }
      });
    }

    // Inline button to toggle or configure budget goal from summary banner
    if (DOM.toggleBudgetModeInlineBtn) {
      DOM.toggleBudgetModeInlineBtn.addEventListener('click', openSettingsModal);
    }

    // Auto-fill full payment milestone on wedding day
    if (DOM.autoFillMilestoneBtn) {
      DOM.autoFillMilestoneBtn.addEventListener('click', () => {
        const est = Number(DOM.expenseEstimatedCost.value) || 0;
        const act = Number(DOM.expenseActualCost.value) || 0;
        const amt = act > 0 ? act : est;
        DOM.modalMilestonesContainer.innerHTML = '';
        addMilestoneInputRow({
          title: 'Full Payment on Wedding Day',
          amount: amt,
          dueDate: state.weddingDate || '',
          isPaid: false
        });
        showToast('Set payment due on wedding day', '⚡');
      });
    }

    // Live sync estimated cost with milestone if only 1 milestone row exists
    if (DOM.expenseEstimatedCost) {
      DOM.expenseEstimatedCost.addEventListener('input', () => {
        const est = Number(DOM.expenseEstimatedCost.value) || 0;
        const rows = DOM.modalMilestonesContainer.querySelectorAll('.milestone-input-row');
        if (rows.length === 1) {
          const amtInput = rows[0].querySelector('.m-amount');
          const titleInput = rows[0].querySelector('.m-title');
          if (amtInput && (!amtInput.value || Number(amtInput.value) === 0 || (titleInput && titleInput.value.toLowerCase().includes('payment')))) {
            amtInput.value = est > 0 ? est : '';
          }
        }
      });
    }

    DOM.openDataToolsBtn.addEventListener('click', () => DOM.dataModal.showModal());
    DOM.closeDataModalBtn.addEventListener('click', () => DOM.dataModal.close());

    DOM.printReportBtn.addEventListener('click', () => window.print());
    DOM.jumpToSimulatorBtn.addEventListener('click', () => switchTab('simulator'));
    DOM.viewAllScheduleBtn.addEventListener('click', () => switchTab('schedule'));

    // Auto-solve pace button
    DOM.autoSolvePaceBtn.addEventListener('click', () => {
      const data = calculateFinancialAnalytics();
      const recommended = data.simulation.recommendedPaycheckSavings;
      if (recommended > 0) {
        state.plannedSavingsPerPaycheck = recommended;
        DOM.simPlannedSavings.value = recommended;
        saveState();
        showToast(`Savings pace optimized to ${formatCurrency(recommended)} / ${getCadenceName(state.paycheckCadence)}!`, '⚡');
        renderAll();
      } else {
        showToast('Your current savings already fully cover your wedding milestones!', '✨');
      }
    });

    // Simulator input changes (live update)
    [DOM.simCurrentSavings, DOM.simPlannedSavings, DOM.simSafetyCushion].forEach(inp => {
      inp.addEventListener('input', () => {
        state.currentSavings = Number(DOM.simCurrentSavings.value) || 0;
        state.plannedSavingsPerPaycheck = Number(DOM.simPlannedSavings.value) || 0;
        state.safetyCushion = Number(DOM.simSafetyCushion.value) || 0;
        saveState();
        renderAll();
      });
    });

    DOM.simPaycheckCadence.addEventListener('change', () => {
      state.paycheckCadence = DOM.simPaycheckCadence.value;
      saveState();
      renderAll();
    });

    // Toggle categories collapse
    let allCollapsed = false;
    DOM.toggleAllCategoriesBtn.addEventListener('click', () => {
      allCollapsed = !allCollapsed;
      document.querySelectorAll('.category-header-row').forEach(row => {
        const catId = row.dataset.catId;
        const list = document.getElementById(`catList-${catId}`);
        if (list) {
          if (allCollapsed) {
            list.classList.add('hidden');
            row.classList.add('collapsed');
          } else {
            list.classList.remove('hidden');
            row.classList.remove('collapsed');
          }
        }
      });
    });

    // Category click delegation for individual accordion
    DOM.budgetCategoryGroupsContainer.addEventListener('click', e => {
      const header = e.target.closest('.category-header-row');
      if (header) {
        const catId = header.dataset.catId;
        const list = document.getElementById(`catList-${catId}`);
        if (list) {
          list.classList.toggle('hidden');
          header.classList.toggle('collapsed');
        }
        return;
      }

      // Edit expense button
      const editBtn = e.target.closest('.edit-expense-btn');
      if (editBtn) {
        const expId = editBtn.dataset.expId;
        const exp = state.expenses.find(x => x.id === expId);
        if (exp) openExpenseModal(exp);
        return;
      }

      // Delete expense button
      const delBtn = e.target.closest('.delete-expense-btn');
      if (delBtn) {
        const expId = delBtn.dataset.expId;
        const exp = state.expenses.find(x => x.id === expId);
        if (exp && confirm(`Delete "${exp.name}" and all its payment milestones?`)) {
          state.expenses = state.expenses.filter(x => x.id !== expId);
          saveState();
          showToast(`Deleted "${exp.name}"`, '🗑️');
          renderAll();
        }
        return;
      }
    });

    // Mark Paid / Mark Unpaid delegation (on dashboard & schedule)
    document.addEventListener('click', e => {
      const markPaidBtn = e.target.closest('.mark-paid-btn');
      if (markPaidBtn) {
        const expId = markPaidBtn.dataset.expId;
        const milestoneId = markPaidBtn.dataset.milestoneId;
        toggleMilestonePaid(expId, milestoneId, true);
        return;
      }

      const markUnpaidBtn = e.target.closest('.mark-unpaid-btn');
      if (markUnpaidBtn) {
        const expId = markUnpaidBtn.dataset.expId;
        const milestoneId = markUnpaidBtn.dataset.milestoneId;
        toggleMilestonePaid(expId, milestoneId, false);
        return;
      }
    });

    // Data Tools
    DOM.exportJsonBtn.addEventListener('click', exportDataJson);
    DOM.exportCsvBtn.addEventListener('click', exportDataCsv);
    DOM.importJsonInput.addEventListener('change', importDataJson);
    DOM.loadSampleDataBtn.addEventListener('click', () => {
      if (confirm('Load sample wedding data? This will replace your current entries.')) {
        state = JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
        state._explicitSampleLoaded = true;
        saveState();
        DOM.dataModal.close();
        showToast('Sample wedding data loaded', '💍');
        renderAll();
      }
    });
    DOM.resetAllDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to start from scratch? All expenses will be cleared.')) {
        state = getBlankState();
        saveState();
        DOM.dataModal.close();
        showToast('Started fresh blank-slate wedding plan', '🌱');
        renderAll();
      }
    });

    // Window resize chart re-render
    window.addEventListener('resize', debounce(() => {
      renderCharts(calculateFinancialAnalytics());
    }, 150));
  }

  function switchTab(tabName) {
    activeTab = tabName;
    DOM.tabButtons.forEach(btn => {
      const isSelected = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected);
    });

    Object.keys(DOM.tabPanes).forEach(paneKey => {
      if (paneKey === tabName) {
        DOM.tabPanes[paneKey].style.display = 'block';
        DOM.tabPanes[paneKey].classList.add('active');
      } else {
        DOM.tabPanes[paneKey].style.display = 'none';
        DOM.tabPanes[paneKey].classList.remove('active');
      }
    });

    // Render charts on active tab
    setTimeout(() => {
      renderCharts(calculateFinancialAnalytics());
    }, 50);
  }

  function toggleMilestonePaid(expenseId, milestoneId, isPaid) {
    const exp = state.expenses.find(x => x.id === expenseId);
    if (!exp || !exp.milestones) return;
    const m = exp.milestones.find(x => x.id === milestoneId);
    if (!m) return;

    m.isPaid = isPaid;
    m.paidDate = isPaid ? new Date().toISOString().split('T')[0] : null;

    saveState();
    showToast(isPaid ? `Marked "${m.title}" as paid! 🎉` : `Reverted "${m.title}" to unpaid`, isPaid ? '✅' : '↩');
    renderAll();
  }

  // =========================================================================
  // EXPORT / IMPORT HELPERS
  // =========================================================================
  function exportDataJson() {
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-budget-${state.coupleNames.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported wedding JSON backup', '📥');
  }

  function exportDataCsv() {
    const milestones = getAllMilestones();
    const headers = ['Category', 'Expense Name', 'Vendor', 'Milestone Title', 'Amount Due ($)', 'Due Date', 'Status', 'Days Remaining'];
    const rows = milestones.map(m => [
      `"${m.categoryId}"`,
      `"${m.expenseName.replace(/"/g, '""')}"`,
      `"${m.vendor.replace(/"/g, '""')}"`,
      `"${m.title.replace(/"/g, '""')}"`,
      m.amount,
      m.dueDate,
      m.isPaid ? 'PAID' : (m.daysRemaining < 0 ? 'OVERDUE' : 'UPCOMING'),
      m.daysRemaining
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-payment-schedule-${state.coupleNames.toLowerCase().replace(/[^a-z0-9]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported payment schedule CSV', '📊');
  }

  function importDataJson(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const imported = JSON.parse(evt.target.result);
        if (imported && imported.expenses) {
          state = imported;
          saveState();
          DOM.dataModal.close();
          showToast('Imported wedding data successfully!', '✨');
          renderAll();
        } else {
          alert('Invalid file format: Missing expenses array.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
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

  function debounce(fn, ms) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // =========================================================================
  // TOOLTIP & EXPLANATION SYSTEM
  // =========================================================================
  const TOOLTIP_DATA = {
    'tt-safety-cushion': {
      icon: '🛡️',
      title: 'Safety Cushion Reserve',
      body: 'A protected cash buffer kept in your wedding savings account at all times that is never spent on planned wedding bills.',
      howItWorks: 'The Cashflow Simulator tests your planned savings against each vendor’s payment due date. If an upcoming bill (like a big venue deposit or caterer final balance) would draw your bank balance below this cushion, you receive an immediate advance warning so you can adjust your savings pace before the deadline.',
      tip: '💡 Most couples maintain a $1,000 – $2,000 buffer to absorb surprise alteration fees, vendor gratuities, delivery surcharges, or sudden guest count changes without financial stress.'
    },
    'tt-current-savings': {
      icon: '🏦',
      title: 'Current Wedding Savings',
      body: 'The exact amount of cash you and your partner have in your wedding savings account right now.',
      howItWorks: 'This serves as your starting baseline. All upcoming vendor payment milestones draw down from this pool as they come due, while your planned paycheck contributions replenish it over time.'
    },
    'tt-cadence': {
      icon: '⏱️',
      title: 'Savings Cadence',
      body: 'How frequently you deposit money into your wedding savings account.',
      howItWorks: 'Matches your real-world paycheck cycle (Weekly = 7 days, Bi-Weekly = 14 days, Semi-Monthly = 15.2 days, Monthly = 30.4 days) so the simulation mirrors your exact cash inflow.'
    },
    'tt-planned-savings': {
      icon: '💰',
      title: 'Savings per Paycheck',
      body: 'The dollar amount you and your partner plan to set aside each pay period towards your wedding.',
      howItWorks: 'The simulator calculates your projected bank balance after every single paycheck. If you fall short on any due date, click "⚡ Auto-Balance Savings Pace" in the Simulator to calculate the exact pace needed.'
    },
    'tt-budget-goal': {
      icon: '🎯',
      title: 'Fixed Budget vs. Bottom-Up',
      body: 'You do not need a fixed budget upfront to plan your wedding!',
      howItWorks: '• Bottom-Up (Default): Calculates your wedding total by adding up the estimated costs of items you actually plan to have.\n• Budget Goal: Lets you set an overall spending cap to track whether your estimates stay under or over budget.'
    }
  };

  let activeTooltipTrigger = null;
  const tooltipEl = document.getElementById('globalTooltip');

  function showTooltip(triggerEl) {
    const tooltipId = triggerEl.dataset.tooltipId;
    const data = TOOLTIP_DATA[tooltipId];
    if (!data || !tooltipEl) return;

    activeTooltipTrigger = triggerEl;

    tooltipEl.innerHTML = `
      <div class="tooltip-header">
        <span class="tooltip-icon">${data.icon || 'ℹ️'}</span>
        <strong>${escapeHtml(data.title)}</strong>
      </div>
      <div class="tooltip-body">${escapeHtml(data.body)}</div>
      ${data.howItWorks ? `
        <div class="tooltip-how">
          <strong>How it works:</strong> ${escapeHtml(data.howItWorks)}
        </div>
      ` : ''}
      ${data.tip ? `
        <div class="tooltip-tip">${escapeHtml(data.tip)}</div>
      ` : ''}
      <div class="tooltip-arrow" id="tooltipArrow"></div>
    `;

    // Ensure tooltip element is in top-layer popover if supported
    if (typeof tooltipEl.showPopover === 'function') {
      try {
        if (!tooltipEl.matches(':popover-open')) {
          tooltipEl.showPopover();
        }
      } catch (err) {
        tooltipEl.style.display = 'block';
      }
    } else {
      tooltipEl.style.display = 'block';
    }

    positionTooltip(triggerEl);
    tooltipEl.classList.add('visible');
  }

  function positionTooltip(triggerEl) {
    if (!tooltipEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const ttRect = tooltipEl.getBoundingClientRect();
    const arrow = document.getElementById('tooltipArrow');

    const gap = 10;
    const padding = 14;

    // Check space above vs below
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < (ttRect.height + gap + 10) && spaceAbove > spaceBelow;

    let top;
    if (placeAbove) {
      top = rect.top - ttRect.height - gap;
      if (arrow) arrow.className = 'tooltip-arrow arrow-down';
    } else {
      top = rect.bottom + gap;
      if (arrow) arrow.className = 'tooltip-arrow arrow-up';
    }

    // Horizontal centering
    let left = rect.left + (rect.width / 2) - (ttRect.width / 2);
    left = Math.max(padding, Math.min(window.innerWidth - ttRect.width - padding, left));

    // Align arrow to trigger center
    if (arrow) {
      const triggerCenter = rect.left + (rect.width / 2);
      const arrowLeft = Math.max(16, Math.min(ttRect.width - 24, triggerCenter - left));
      arrow.style.left = `${arrowLeft}px`;
    }

    tooltipEl.style.top = `${Math.round(top)}px`;
    tooltipEl.style.left = `${Math.round(left)}px`;
  }

  function hideTooltip() {
    if (!tooltipEl) return;
    activeTooltipTrigger = null;
    tooltipEl.classList.remove('visible');
    if (typeof tooltipEl.hidePopover === 'function') {
      try {
        if (tooltipEl.matches(':popover-open')) {
          tooltipEl.hidePopover();
        }
      } catch (err) {
        tooltipEl.style.display = 'none';
      }
    } else {
      tooltipEl.style.display = 'none';
    }
  }

  function setupTooltipListeners() {
    document.querySelectorAll('.label-text-with-tooltip').forEach(el => {
      el.addEventListener('mouseenter', () => showTooltip(el));
      el.addEventListener('mouseleave', () => hideTooltip());
      el.addEventListener('focus', () => showTooltip(el));
      el.addEventListener('blur', () => hideTooltip());

      // Toggle on mobile click / tap
      el.addEventListener('click', (e) => {
        if (activeTooltipTrigger === el) {
          hideTooltip();
        } else {
          showTooltip(el);
          e.stopPropagation();
        }
      });
    });

    // Dismiss tooltip on outside click or escape
    document.addEventListener('click', (e) => {
      if (activeTooltipTrigger && !e.target.closest('.label-text-with-tooltip')) {
        hideTooltip();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeTooltipTrigger) {
        hideTooltip();
      }
    });

    // Reposition on scroll or resize if active
    window.addEventListener('scroll', () => {
      if (activeTooltipTrigger) positionTooltip(activeTooltipTrigger);
    }, { passive: true });
    window.addEventListener('resize', () => {
      if (activeTooltipTrigger) positionTooltip(activeTooltipTrigger);
    }, { passive: true });

    document.querySelectorAll('.modal-body').forEach(mb => {
      mb.addEventListener('scroll', () => {
        if (activeTooltipTrigger) positionTooltip(activeTooltipTrigger);
      }, { passive: true });
    });
  }

  // Start the application
  window.addEventListener('DOMContentLoaded', init);
})();
