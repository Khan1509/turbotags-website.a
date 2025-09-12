// Simplified performance monitoring without web-vitals dependency for now
// We'll use Performance Observer API directly

// Performance metrics thresholds (Google's recommendations)
const THRESHOLDS = {
  LCP: { good: 2500, needs_improvement: 4000 },
  FID: { good: 100, needs_improvement: 300 },
  CLS: { good: 0.1, needs_improvement: 0.25 },
  FCP: { good: 1800, needs_improvement: 3000 },
  TTFB: { good: 800, needs_improvement: 1800 },
  INP: { good: 200, needs_improvement: 500 }
};

// Function to determine performance rating
function getPerformanceRating(value, thresholds) {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needs_improvement) return 'needs-improvement';
  return 'poor';
}

// Enhanced metric handler with analytics integration
function sendToAnalytics({ name, value, rating, delta, navigationType }) {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`🚀 [Performance] ${name}:`, {
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
      navigationType
    });
  }
  
  // Send to analytics services (Firebase, GA4, etc.)
  if (typeof window !== 'undefined') {
    // Firebase Analytics (if available)
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: name,
        value: Math.round(value),
        custom_parameter_rating: rating,
        custom_parameter_navigation_type: navigationType
      });
    }
    
    // Vercel Analytics (if available)
    if (window.va) {
      window.va('track', 'web_vitals', {
        metric: name,
        value: Math.round(value),
        rating,
        navigationType
      });
    }
    
    // Custom performance tracking
    const performanceData = {
      metric: name,
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
      navigationType,
      timestamp: Date.now(),
      url: window.location.href
    };
    
    // Store in localStorage for performance dashboard
    const existingData = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
    existingData.push(performanceData);
    
    // Keep only last 100 measurements
    if (existingData.length > 100) {
      existingData.splice(0, existingData.length - 100);
    }
    
    localStorage.setItem('performance_metrics', JSON.stringify(existingData));
  }
}

// Initialize performance monitoring using native Performance Observer API
export function initPerformanceMonitoring() {
  // Only run in browser environment
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;
  
  console.log('🚀 Performance monitoring initialized');
  
  // Monitor Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        const value = lastEntry.startTime;
        const rating = getPerformanceRating(value, THRESHOLDS.LCP);
        sendToAnalytics({
          name: 'LCP',
          value,
          rating,
          delta: value,
          navigationType: 'navigate'
        });
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP monitoring not supported');
  }
  
  // Monitor First Contentful Paint (FCP)
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        const value = fcpEntry.startTime;
        const rating = getPerformanceRating(value, THRESHOLDS.FCP);
        sendToAnalytics({
          name: 'FCP',
          value,
          rating,
          delta: value,
          navigationType: 'navigate'
        });
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
  } catch (e) {
    console.warn('FCP monitoring not supported');
  }
  
  // Monitor Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      const rating = getPerformanceRating(clsValue, THRESHOLDS.CLS);
      sendToAnalytics({
        name: 'CLS',
        value: clsValue,
        rating,
        delta: clsValue,
        navigationType: 'navigate'
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS monitoring not supported');
  }
  
  // Monitor First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        const value = entry.processingStart - entry.startTime;
        const rating = getPerformanceRating(value, THRESHOLDS.FID);
        sendToAnalytics({
          name: 'FID',
          value,
          rating,
          delta: value,
          navigationType: 'navigate'
        });
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('FID monitoring not supported');
  }
  
  // Monitor Time to First Byte (TTFB)
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const value = navigationEntry.responseStart - navigationEntry.requestStart;
      const rating = getPerformanceRating(value, THRESHOLDS.TTFB);
      sendToAnalytics({
        name: 'TTFB',
        value,
        rating,
        delta: value,
        navigationType: 'navigate'
      });
    }
  } catch (e) {
    console.warn('TTFB monitoring not supported');
  }
}

// Get performance summary for dashboard
export function getPerformanceSummary() {
  if (typeof window === 'undefined') return null;
  
  const metrics = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
  
  if (metrics.length === 0) return null;
  
  const summary = {};
  const metricTypes = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'];
  
  metricTypes.forEach(type => {
    const typeMetrics = metrics.filter(m => m.metric === type);
    if (typeMetrics.length > 0) {
      const values = typeMetrics.map(m => m.value);
      const ratings = typeMetrics.map(m => m.rating);
      
      summary[type] = {
        latest: values[values.length - 1],
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
        latestRating: ratings[ratings.length - 1],
        goodCount: ratings.filter(r => r === 'good').length,
        needsImprovementCount: ratings.filter(r => r === 'needs-improvement').length,
        poorCount: ratings.filter(r => r === 'poor').length
      };
    }
  });
  
  return summary;
}

// Clear performance data
export function clearPerformanceData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('performance_metrics');
    console.log('🧹 Performance data cleared');
  }
}

// Export for development debugging
export { THRESHOLDS };