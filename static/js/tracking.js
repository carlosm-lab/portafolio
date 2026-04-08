/**
 * ════════════════════════════════════════════════════════════════════════════
 * ANALYTICS TRACKING FUNCTIONS
 * Google Analytics 4 event tracking for contact and social interactions
 * ════════════════════════════════════════════════════════════════════════════
 */

// Debug mode - set to true only during development
const TRACKING_DEBUG = false;

function debugLog(...args) {
    if (TRACKING_DEBUG) console.log('[Tracking]', ...args);
}

/**
 * Track contact interactions (email, phone clicks)
 * @param {string} type - Contact type (email, phone)
 */
function trackContactClick(type) {
    if (typeof gtag === 'function') {
        gtag('event', 'contact_click', {
            'event_category': 'engagement',
            'event_label': type,
            'contact_method': type
        });
    }
    debugLog('Contact tracked:', type);
}

/**
 * Track social media link clicks
 * @param {string} platform - Social platform (linkedin, github, platzi, etc.)
 */
function trackSocialClick(platform) {
    if (typeof gtag === 'function') {
        gtag('event', 'social_click', {
            'event_category': 'engagement',
            'event_label': platform,
            'social_platform': platform
        });
    }
    debugLog('Social tracked:', platform);
}

/**
 * Track CV downloads
 */
function trackCVDownload() {
    if (typeof gtag === 'function') {
        gtag('event', 'file_download', {
            'event_category': 'engagement',
            'event_label': 'CV',
            'file_name': 'carlos_molina_cv.pdf'
        });
    }
    debugLog('CV download tracked');
}
