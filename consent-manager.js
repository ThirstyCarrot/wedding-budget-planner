/**
 * @file consent-manager.js
 * @description Enterprise GDPR, CCPA/CPRA & ePrivacy Cookie Consent Architecture.
 * Complies with:
 * - GDPR (EU 2016/679) Articles 4(11), 7, 12, 13 (Prior explicit opt-in consent)
 * - ePrivacy Directive (2002/58/EC as amended by 2009/136/EC) Article 5(3)
 * - California Consumer Privacy Act / CPRA (Cal. Civ. Code § 1798.135 - GPC mandate)
 * - W3C Global Privacy Control (GPC) Specification
 * - WCAG 2.2 AA Keyboard navigation and screen reader semantics
 */

(function(window, document) {
  'use strict';

  const STORAGE_KEY = 'ep_cookie_consent_v1';
  const CONSENT_VERSION = '1.0.0';

  /**
   * Default state schema enforcing strict prior-consent opt-in for all optional categories.
   * @type {Readonly<Object>}
   */
  const DEFAULT_CONSENT = Object.freeze({
    version: CONSENT_VERSION,
    timestamp: null,
    gpcActive: false,
    categories: Object.freeze({
      necessary: true,   // Always true, non-negotiable under ePrivacy Art 5(3)
      analytics: false,  // Explicit opt-in required prior to script execution
      marketing: false   // Explicit opt-in required prior to script execution
    })
  });

  let currentConsent = null;
  const callbacks = [];

  /**
   * Detects browser-level privacy signals including Global Privacy Control (GPC) and Do Not Track (DNT).
   * @returns {boolean} True if a proactive opt-out signal is asserted by the user agent.
   */
  function detectGpcSignal() {
    return (
      (typeof navigator !== 'undefined' && (
        navigator.globalPrivacyControl === true ||
        navigator.globalPrivacyControl === '1'
      )) ||
      (typeof window !== 'undefined' && window.globalPrivacyControl === true) ||
      (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') ||
      (typeof window !== 'undefined' && window.doNotTrack === '1')
    );
  }

  /**
   * Loads and validates previously stored consent record from localStorage.
   * @returns {Object|null} Stored consent record if valid, otherwise null.
   */
  function loadStoredConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === CONSENT_VERSION && parsed.categories) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[ConsentManager] Storage read failure, falling back to clean state', e);
    }
    return null;
  }

  // Persist consent to storage and emit event
  function saveConsent(categories) {
    const isGpc = detectGpcSignal();
    const record = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      gpcActive: isGpc,
      categories: {
        necessary: true,
        analytics: Boolean(categories.analytics),
        // If GPC is active, marketing/sale/sharing must strictly remain false under CCPA/CPRA
        marketing: isGpc ? false : Boolean(categories.marketing)
      }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (e) {
      console.error('[ConsentManager] Storage write failure', e);
    }

    currentConsent = record;
    applyConsent(record);
    notifyCallbacks(record);
  }

  // Enforce prior-consent script execution
  function applyConsent(record) {
    // 1. Dispatch custom DOM event
    window.dispatchEvent(new CustomEvent('consentUpdated', { detail: record }));

    // 2. Unlock and execute queued text/plain script tags matching enabled categories
    const queuedScripts = document.querySelectorAll('script[type="text/plain"][data-consent-category]');
    queuedScripts.forEach(script => {
      const category = script.getAttribute('data-consent-category');
      if (record.categories[category] === true) {
        const executableScript = document.createElement('script');
        // Copy all attributes
        Array.from(script.attributes).forEach(attr => {
          if (attr.name !== 'type' && attr.name !== 'data-consent-category') {
            executableScript.setAttribute(attr.name, attr.value);
          }
        });

        if (script.src) {
          executableScript.src = script.src;
        } else {
          executableScript.textContent = script.textContent;
        }

        // Replace placeholder script with active executable script
        script.parentNode.insertBefore(executableScript, script);
        script.parentNode.removeChild(script);
        console.info(`[ConsentManager] Activated deferred script for category [${category}]`);
      }
    });

    // 3. Clear non-consented cookies if consent was revoked
    if (!record.categories.analytics) {
      purgeCookies(['_ga', '_gid', '_gat', '_gat_gtag', 'amp_', 'mp_']);
    }
    if (!record.categories.marketing) {
      purgeCookies(['_fbp', '_gcl_au', 'ide', 'personalization_id', 'uuid']);
    }
  }

  // Utility to purge specific cookie prefixes
  function purgeCookies(cookieNames) {
    const domain = window.location.hostname;
    const paths = ['/', '/dashboard'];
    cookieNames.forEach(name => {
      paths.forEach(path => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
      });
    });
  }

  function notifyCallbacks(record) {
    callbacks.forEach(fn => {
      try {
        fn(record);
      } catch (err) {
        console.error('[ConsentManager] Callback error', err);
      }
    });
  }

  // UI Component Generator (Accessible Dialog & Banner)
  function injectConsentUI() {
    if (document.getElementById('consentBannerRoot')) return;

    const isGpc = detectGpcSignal();

    const bannerHtml = `
      <aside id="consentBannerRoot" class="consent-banner-wrapper" aria-label="Privacy & Cookie Preferences" role="region">
        <div class="consent-banner-card">
          <div class="consent-banner-content">
            <div class="consent-banner-header">
              <svg class="consent-shield-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <h2 id="consentBannerTitle">Your Privacy & Cookie Choices</h2>
            </div>
            <p class="consent-banner-text">
              We respect your right to privacy. We only use strictly necessary cookies to ensure secure operations. 
              With your permission, we also use optional analytics and performance cookies to help us improve the planner. 
              You can review details or tailor your choices in our 
              <a href="/cookie-policy" target="_blank" rel="noopener">Cookie Policy</a> and 
              <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>.
            </p>
            ${isGpc ? `
              <div class="consent-gpc-pill" role="status">
                <span class="gpc-dot" aria-hidden="true"></span>
                <strong>Global Privacy Control (GPC) Signal Detected:</strong> Third-party tracking and data sharing have been automatically disabled.
              </div>
            ` : ''}
          </div>
          <div class="consent-banner-actions">
            <button type="button" class="btn btn-secondary btn-sm" id="consentBtnCustomize">Customize Choices</button>
            <button type="button" class="btn btn-outline btn-sm" id="consentBtnRejectAll">Reject Non-Essential</button>
            <button type="button" class="btn btn-primary btn-sm" id="consentBtnAcceptAll">Accept All</button>
          </div>
        </div>
      </aside>

      <!-- Granular Preferences Modal Dialog -->
      <dialog id="consentModalDialog" class="consent-modal" aria-labelledby="consentModalTitle" aria-describedby="consentModalDesc">
        <div class="consent-modal-content">
          <header class="consent-modal-header">
            <div>
              <h2 id="consentModalTitle">Privacy & Cookie Settings</h2>
              <p id="consentModalDesc" class="consent-modal-sub">
                Manage your consent preferences for each category. You may change or withdraw your consent at any time.
              </p>
            </div>
            <button type="button" class="btn btn-text" id="closeConsentModalBtn" aria-label="Close cookie settings">✕</button>
          </header>

          <form id="consentCategoryForm" class="consent-modal-body">
            <!-- 1. Strictly Necessary -->
            <div class="consent-category-row">
              <div class="category-info">
                <div class="category-title-group">
                  <h3>Strictly Necessary Cookies</h3>
                  <span class="category-badge required">Always Active</span>
                </div>
                <p>Essential for page navigation, data encryption, account security, and remembering your consent status. These cannot be disabled.</p>
              </div>
              <div class="category-toggle">
                <input type="checkbox" id="catNecessary" checked disabled aria-label="Strictly Necessary Cookies (Always Active)">
              </div>
            </div>

            <!-- 2. Performance & Analytics -->
            <div class="consent-category-row">
              <div class="category-info">
                <div class="category-title-group">
                  <h3>Analytics & Performance</h3>
                  <span class="category-badge optional">Optional</span>
                </div>
                <p>Helps us understand how couples interact with our budget tools through aggregated, anonymized metrics. No identifiable personal profiles are constructed.</p>
              </div>
              <div class="category-toggle">
                <label class="switch-toggle" for="catAnalytics">
                  <input type="checkbox" id="catAnalytics">
                  <span class="slider round"></span>
                  <span class="sr-only">Toggle Analytics & Performance Cookies</span>
                </label>
              </div>
            </div>

            <!-- 3. Marketing & Tracking -->
            <div class="consent-category-row">
              <div class="category-info">
                <div class="category-title-group">
                  <h3>Marketing & Personalization</h3>
                  <span class="category-badge optional">Optional</span>
                </div>
                <p>Used to personalize relevant wedding planning content and avoid redundant partner offers across platforms. ${isGpc ? '<strong>(Disabled by your browser GPC signal)</strong>' : ''}</p>
              </div>
              <div class="category-toggle">
                <label class="switch-toggle" for="catMarketing">
                  <input type="checkbox" id="catMarketing" ${isGpc ? 'disabled' : ''}>
                  <span class="slider round"></span>
                  <span class="sr-only">Toggle Marketing & Personalization Cookies</span>
                </label>
              </div>
            </div>
          </form>

          <footer class="consent-modal-footer">
            <button type="button" class="btn btn-outline" id="consentModalRejectAll">Reject All</button>
            <button type="button" class="btn btn-secondary" id="consentModalSavePreferences">Save My Preferences</button>
            <button type="button" class="btn btn-primary" id="consentModalAcceptAll">Accept All</button>
          </footer>
        </div>
      </dialog>
    `;

    const div = document.createElement('div');
    div.innerHTML = bannerHtml;
    document.body.appendChild(div);

    bindConsentEvents();
  }

  function bindConsentEvents() {
    const banner = document.getElementById('consentBannerRoot');
    const modal = document.getElementById('consentModalDialog');
    const btnAcceptAll = document.getElementById('consentBtnAcceptAll');
    const btnRejectAll = document.getElementById('consentBtnRejectAll');
    const btnCustomize = document.getElementById('consentBtnCustomize');
    const btnCloseModal = document.getElementById('closeConsentModalBtn');
    const btnSavePref = document.getElementById('consentModalSavePreferences');
    const btnModalAcceptAll = document.getElementById('consentModalAcceptAll');
    const btnModalRejectAll = document.getElementById('consentModalRejectAll');

    const checkAnalytics = document.getElementById('catAnalytics');
    const checkMarketing = document.getElementById('catMarketing');

    function closeBanner() {
      if (banner) banner.style.display = 'none';
    }

    if (btnAcceptAll) {
      btnAcceptAll.addEventListener('click', () => {
        saveConsent({ necessary: true, analytics: true, marketing: true });
        closeBanner();
      });
    }

    if (btnRejectAll) {
      btnRejectAll.addEventListener('click', () => {
        saveConsent({ necessary: true, analytics: false, marketing: false });
        closeBanner();
      });
    }

    if (btnCustomize) {
      btnCustomize.addEventListener('click', () => {
        if (modal) {
          const active = currentConsent ? currentConsent.categories : { analytics: false, marketing: false };
          if (checkAnalytics) checkAnalytics.checked = Boolean(active.analytics);
          if (checkMarketing && !checkMarketing.disabled) checkMarketing.checked = Boolean(active.marketing);
          modal.showModal();
        }
      });
    }

    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        if (modal) modal.close();
      });
    }

    if (btnSavePref) {
      btnSavePref.addEventListener('click', () => {
        saveConsent({
          necessary: true,
          analytics: checkAnalytics ? checkAnalytics.checked : false,
          marketing: checkMarketing && !checkMarketing.disabled ? checkMarketing.checked : false
        });
        if (modal) modal.close();
        closeBanner();
      });
    }

    if (btnModalAcceptAll) {
      btnModalAcceptAll.addEventListener('click', () => {
        saveConsent({ necessary: true, analytics: true, marketing: true });
        if (modal) modal.close();
        closeBanner();
      });
    }

    if (btnModalRejectAll) {
      btnModalRejectAll.addEventListener('click', () => {
        saveConsent({ necessary: true, analytics: false, marketing: false });
        if (modal) modal.close();
        closeBanner();
      });
    }
  }

  /**
   * Public interface for consent state inspection, preference modal invocation, and event subscription.
   */
  window.ConsentManager = {
    /**
     * Initializes consent state from localStorage or displays prior-consent banner.
     */
    init: function() {
      const stored = loadStoredConsent();
      if (stored) {
        currentConsent = stored;
        applyConsent(stored);
      } else {
        // No consent recorded: inject UI and enforce prior-consent blocking
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', injectConsentUI);
        } else {
          injectConsentUI();
        }
      }
    },

    /**
     * Programmatically opens the granular cookie preferences modal dialog.
     */
    openSettings: function() {
      const modal = document.getElementById('consentModalDialog');
      if (!modal) {
        injectConsentUI();
      }
      setTimeout(() => {
        const m = document.getElementById('consentModalDialog');
        const checkAnalytics = document.getElementById('catAnalytics');
        const checkMarketing = document.getElementById('catMarketing');
        if (m) {
          const active = currentConsent ? currentConsent.categories : { analytics: false, marketing: false };
          if (checkAnalytics) checkAnalytics.checked = Boolean(active.analytics);
          if (checkMarketing && !checkMarketing.disabled) checkMarketing.checked = Boolean(active.marketing);
          m.showModal();
        }
      }, 50);
    },

    /**
     * Checks if explicit user consent has been granted for a specific category.
     * @param {('necessary'|'analytics'|'marketing')} category - Consent category to verify.
     * @returns {boolean} True if category is active and consented.
     */
    hasConsent: function(category) {
      if (category === 'necessary') return true;
      if (!currentConsent || !currentConsent.categories) return false;
      return currentConsent.categories[category] === true;
    },

    /**
     * Returns an immutable copy of current consent record or default baseline state.
     * @returns {Object} Deep-cloned consent object.
     */
    getConsent: function() {
      return JSON.parse(JSON.stringify(currentConsent || DEFAULT_CONSENT));
    },

    /**
     * Registers a callback listener triggered whenever consent preferences are updated.
     * @param {Function} callback - Function receiving the updated consent record.
     */
    onConsentUpdate: function(callback) {
      if (typeof callback === 'function') {
        callbacks.push(callback);
        if (currentConsent) callback(currentConsent);
      }
    }
  };

  // Auto-initialize
  window.ConsentManager.init();

})(window, document);
