// Centralized tracking helper — fires events to Meta Pixel, TikTok Pixel, and GA4

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
    };
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Track a page view across all platforms */
export function trackPageView() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
  window.ttq?.page();
  // GA4 handles page views automatically with config
}

/** Track when user starts the free diagnostic quiz */
export function trackDiagnosticStart() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", { content_name: "diagnostic_gratuit" });
  window.ttq?.track("SubmitForm", { content_name: "diagnostic_gratuit" });
  window.gtag?.("event", "diagnostic_start", { event_category: "engagement" });
}

/** Track when user completes the diagnostic and submits email */
export function trackDiagnosticComplete(email?: string) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "CompleteRegistration", {
    content_name: "diagnostic_email",
  });
  window.ttq?.track("CompleteRegistration", {
    content_name: "diagnostic_email",
  });
  window.gtag?.("event", "generate_lead", {
    event_category: "conversion",
    value: 0,
    currency: "EUR",
  });
}

/** Track when user uploads a file */
export function trackFileUpload() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "AddToCart", { content_name: "devis_upload" });
  window.ttq?.track("AddToCart", { content_name: "devis_upload" });
  window.gtag?.("event", "file_upload", { event_category: "engagement" });
}

/** Track when user initiates checkout */
export function trackInitiateCheckout(planId: string, value: number) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "InitiateCheckout", {
    value,
    currency: "EUR",
    content_name: planId,
  });
  window.ttq?.track("InitiateCheckout", {
    value,
    currency: "EUR",
    content_name: planId,
  });
  window.gtag?.("event", "begin_checkout", {
    value,
    currency: "EUR",
    items: [{ item_name: planId }],
  });
}

/** Track a successful purchase (fire on payment success page) */
export function trackPurchase(planId: string, value: number) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Purchase", {
    value,
    currency: "EUR",
    content_name: planId,
  });
  window.ttq?.track("CompletePayment", {
    value,
    currency: "EUR",
    content_name: planId,
  });
  window.gtag?.("event", "purchase", {
    value,
    currency: "EUR",
    transaction_id: `${planId}_${Date.now()}`,
    items: [{ item_name: planId, price: value }],
  });
}

/** Track referral page visit */
export function trackReferralVisit() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "ViewContent", { content_name: "parrainage" });
  window.ttq?.track("ViewContent", { content_name: "parrainage" });
  window.gtag?.("event", "view_referral", { event_category: "engagement" });
}

/** Track contact form submission */
export function trackContact() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Contact");
  window.ttq?.track("Contact");
  window.gtag?.("event", "contact_form", { event_category: "engagement" });
}
