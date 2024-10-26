import { config } from '../config/env';
import mixpanel from 'mixpanel-browser';

// Initialize analytics
export function initializeAnalytics() {
  // Google Analytics
  if (config.analytics.googleAnalyticsId) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics.googleAnalyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', config.analytics.googleAnalyticsId);
  }

  // Mixpanel
  if (config.analytics.mixpanelToken) {
    mixpanel.init(config.analytics.mixpanelToken, {
      debug: import.meta.env.DEV,
      track_pageview: true
    });
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  // Google Analytics
  window.gtag?.('event', eventName, properties);

  // Mixpanel
  mixpanel.track(eventName, properties);
}

export function trackAffiliateClick(
  toolId: string,
  toolName: string,
  category: string,
  price: number
) {
  const eventProperties = {
    tool_id: toolId,
    tool_name: toolName,
    category,
    price,
    timestamp: new Date().toISOString()
  };

  trackEvent('affiliate_click', eventProperties);
}