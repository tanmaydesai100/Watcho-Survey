import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import StarRating from "./StarRating";
import "../WatchoSurvey.css";

const DELIVERY_OPTIONS = [
  "Arrived early",
  "On time",
  "Slightly delayed",
  "Significantly delayed",
  "Issue with delivery",
];

const STANDOUT_OPTIONS = [
  "Product quality",
  "Website ease of use",
  "Price & value",
  "Packaging & unboxing",
  "Customer service",
  "Delivery speed",
  "Brand trust",
  "Extended warranty",
];

const ISSUE_OPTIONS = [
  "Damaged item",
  "Late delivery",
  "Wrong item",
  "Difficult returns",
  "Other",
] as const;

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtNIxkEKv8Gm2SbLxT-df4DKTmN67vzD-ZUOAVLKfOA5cwCGoSuS74xvVbLFW71bMS/exec";
const PRODUCT_IMAGE = "/watch-product.png";
const PRODUCT_NAME = "Seiko Presage Cocktail Time";
const PRODUCT_META = "40MM | Automatic | Navy Dial";
const DEMO_EMAIL = ""; // Prefill when you have the customer's email (e.g. from order)
const DISCOUNT_CODE = "WATCHO10THANKS";
// Change to your live URL; use a working URL for testing if watcho.co.uk is unreachable (e.g. https://www.watcho.co.uk)
const WATCHO_WEBSITE = "https://www.watcho.co.uk";
const WATCHO_ADDRESS = "12 Deer Walk, Milton Keynes, MK9 3AB";
const WATCHO_PHONE = "+441908983500";
const WATCHO_PHONE_DISPLAY = "+44 1908 983500";
const WATCHO_GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=12+Deer+Walk,+Milton+Keynes,+MK9+3AB";

/** Query params to pass in the survey link; all are optional and included in the POST so your sheet has user/order context.
 *  Example: https://yoursurvey.com?order_id=WTC-12345&email=john@example.com&product=Seiko%20Presage
 */
function getSurveyLinkParams(): {
  order_id: string;
  email: string;
  product: string;
  product_meta: string;
  [key: string]: string;
} {
  const params = new URLSearchParams(window.location.search);
  return {
    order_id: params.get("order_id") ?? "",
    email: params.get("email") ?? "",
    product: params.get("product") ?? "",
    product_meta: params.get("product_meta") ?? "",
    // Pass through any other params you send in the link (e.g. customer_id, campaign)
    ...Object.fromEntries(
      Array.from(params.entries()).filter(
        ([k]) => !["order_id", "email", "product", "product_meta"].includes(k)
      )
    ),
  };
}

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

const CHAT_ICON_SVG = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"
    />
  </svg>
);

export default function WatchoSurvey() {
  const [ratingOverall, setRatingOverall] = useState(0);
  const [ratingProduct, setRatingProduct] = useState(0);
  const [hoverOverall, setHoverOverall] = useState(0);
  const [hoverProduct, setHoverProduct] = useState(0);
  const [delivery, setDelivery] = useState("");
  const [standout, setStandout] = useState<string[]>([]);
  const [nps, setNps] = useState<number | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [contactOptIn, setContactOptIn] = useState(false);
  const [contactEmail, setContactEmail] = useState(DEMO_EMAIL);
  const [comments, setComments] = useState("");
  const [linkParams, setLinkParams] = useState<ReturnType<typeof getSurveyLinkParams> | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showErrorScreen, setShowErrorScreen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const requiredComplete = [
    ratingOverall > 0,
    ratingProduct > 0,
    !!delivery,
    nps !== null,
  ].filter(Boolean).length;
  const emailValid =
    !contactOptIn || (contactEmail.trim() !== "" && isValidEmail(contactEmail));
  const emailError =
    contactOptIn && contactEmail.trim() === ""
      ? "Please enter your email"
      : contactOptIn && contactEmail.trim() !== "" && !isValidEmail(contactEmail)
        ? "Please enter a valid email address"
        : "";
  const canSubmit = requiredComplete === 4 && emailValid;
  const progressPct = Math.round((requiredComplete / 4) * 100);

  const showNegativeIssues = ratingOverall >= 1 && ratingOverall <= 2;
  const showContactOptIn = ratingOverall >= 1 && ratingOverall <= 2;

  useEffect(() => {
    const cards = document.querySelectorAll(".watcho-survey .q-card");
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    cards.forEach((el, i) => {
      timeouts.push(setTimeout(() => el.classList.add("visible"), 120 + i * 90));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [showNegativeIssues, showContactOptIn]);

  // Read survey link params once on load (order_id, email, product, etc.) and prefill email if provided
  useEffect(() => {
    const params = getSurveyLinkParams();
    setLinkParams(params);
    if (params.email) setContactEmail(params.email);
  }, []);

  function toggleStandout(label: string) {
    setStandout((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  }

  function toggleIssue(issue: string) {
    setIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  }

  function closeSuccess() {
    setShowSuccess(false);
    window.location.replace(WATCHO_WEBSITE);
  }

  async function copyDiscountCode() {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  }

  async function handleSubmit() {
    const fromLink = linkParams ?? getSurveyLinkParams();
    const data: Record<string, string | boolean> = {
      timestamp: new Date().toLocaleString("en-GB"),
      order_id: fromLink.order_id || "Not provided",
      product: fromLink.product || PRODUCT_NAME,
      product_meta: fromLink.product_meta || PRODUCT_META,
      overall_rating: ratingOverall > 0 ? String(ratingOverall) : "Not answered",
      product_rating: ratingProduct > 0 ? String(ratingProduct) : "Not answered",
      delivery: delivery || "Not answered",
      standout: standout.length > 0 ? standout.join(", ") : "None",
      nps: nps !== null ? String(nps) : "Not answered",
      issues: issues.length > 0 ? issues.join(", ") : "",
      contact_ok: contactOptIn,
      email: contactOptIn ? contactEmail.trim() : fromLink.email || "",
      comments: comments.trim() || "No comments",
    };
    // Include any extra params from the link (e.g. customer_id, campaign) so the sheet has full context
    Object.entries(fromLink).forEach(([k, v]) => {
      if (v !== "" && !(k in data)) data[k] = v;
    });

    setSubmitting(true);
    setErrorMsg("");
    setShowErrorScreen(false);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
    
      // send the form to your Apps Script web app
      await fetch(SCRIPT_URL, { method: "POST", body: fd, mode: "no-cors" });
    
      setShowSuccess(true);
    } catch {
      setShowErrorScreen(true);
    } finally {
      setSubmitting(false);
    }
  }

  function closeErrorScreen() {
    setShowErrorScreen(false);
    setErrorMsg("");
  }

  return (
    <div className="watcho-survey">
      <div className="topbar">
        🚚 Free UK Delivery &nbsp;·&nbsp; ✓ Authorised Dealer &nbsp;·&nbsp; ★
        Complimentary Extended Warranty &nbsp;·&nbsp; 📞 01908 983 500
      </div>

      <header className="header">
        <div>
          <div className="logo-name">WATCHO</div>
          <div className="logo-tagline">Watches &amp; Jewellery Since 1979</div>
        </div>
        <div className="header-pill">Live Survey</div>
      </header>

      <section className="hero">
        <div className="hero-eyebrow">Post-Purchase Survey</div>
        <h1>
          How was your <em>WATCHO</em>
          <br />
          experience?
        </h1>
        <p className="hero-sub">
          We value every customer's voice. Your feedback helps us continue to
          improve and deliver the service you deserve.
        </p>
        <div className="trust-row">
          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            Confidential
          </div>
          <div className="trust-item">
            <div className="trust-icon">⏱</div>
            2 minutes
          </div>
          <div className="trust-item">
            <div className="trust-icon">🎁</div>
            Reward inside
          </div>
        </div>
      </section>

      <div className="survey-layout">
        <aside className="survey-product-panel" aria-label="Your purchase">
          <div className="survey-product-image-wrap">
            <img
              src={PRODUCT_IMAGE}
              alt={linkParams?.product || PRODUCT_NAME}
              className="survey-product-image"
            />
          </div>
          <div className="survey-product-details">
            <div className="survey-product-brand">WATCHO</div>
            <div className="survey-product-name">{linkParams?.product || PRODUCT_NAME}</div>
            <div className="survey-product-meta">{linkParams?.product_meta || PRODUCT_META}</div>
            <div className="survey-product-order">
              Order #{linkParams?.order_id || "—"} &nbsp;·&nbsp; Delivered 22 Feb 2026
            </div>
            <div className="delivered-badge">✓ Delivered</div>
          </div>
        </aside>

        <div className="survey-form-panel">
          <div className="progress-wrap">
            <div className="progress-head">
              <div className="progress-lbl">Your Progress</div>
              <div className="progress-count">{requiredComplete} of 4 required</div>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="survey-wrap">
        {/* Q1 */}
        <div className="q-card">
          <div className="q-head">
            <div className="q-num">1</div>
            <div className="q-text">
              <div className="q-label">
                Overall, how would you rate your WATCHO experience?
                <span className="q-required">Required</span>
              </div>
              <div className="q-hint">
                From browsing to delivery — your overall impression
              </div>
            </div>
          </div>
          <StarRating
            value={ratingOverall}
            onChange={setRatingOverall}
            hoverValue={hoverOverall}
            onHover={setHoverOverall}
          />
        </div>

        {/* Q2 */}
        <div className="q-card">
          <div className="q-head">
            <div className="q-num">2</div>
            <div className="q-text">
              <div className="q-label">
                How satisfied are you with the product itself?
                <span className="q-required">Required</span>
              </div>
              <div className="q-hint">
                Quality, finish, and how it matched the website description
              </div>
            </div>
          </div>
          <StarRating
            value={ratingProduct}
            onChange={setRatingProduct}
            hoverValue={hoverProduct}
            onHover={setHoverProduct}
          />
        </div>

        {/* Q3 */}
        <div className="q-card">
          <div className="q-head">
            <div className="q-num">3</div>
            <div className="q-text">
              <div className="q-label">
                How was your delivery experience?
                <span className="q-required">Required</span>
              </div>
              <div className="q-hint">
                Timing, packaging quality, and condition on arrival
              </div>
            </div>
          </div>
          <div className="pill-group">
            {DELIVERY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`pill ${delivery === opt ? "selected" : ""}`}
                onClick={() => setDelivery(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q4 */}
        <div className="q-card">
          <div className="q-head">
            <div className="q-num">4</div>
            <div className="q-text">
              <div className="q-label">
                What stood out most about your experience?
                <span className="q-optional">Optional</span>
              </div>
              <div className="q-hint">Select all that apply</div>
            </div>
          </div>
          <div className="pill-group">
            {STANDOUT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`pill multi ${standout.includes(opt) ? "selected" : ""}`}
                onClick={() => toggleStandout(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q5 */}
        <div className="q-card">
          <div className="q-head">
            <div className="q-num">5</div>
            <div className="q-text">
              <div className="q-label">
                How likely are you to recommend WATCHO to someone you know?
                <span className="q-required">Required</span>
              </div>
              <div className="q-hint">
                0 = Not at all likely &nbsp;·&nbsp; 10 = Extremely likely
              </div>
            </div>
          </div>
          <div className="nps-labels">
            <span className="nps-lbl">Not likely</span>
            <span className="nps-lbl">Extremely likely</span>
          </div>
          <div className="nps-row">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <button
                key={val}
                type="button"
                className={`nps-btn ${nps === val ? "selected" : ""}`}
                onClick={() => setNps(val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Q5b – Issue checkboxes (optional, only when overall rating < 4) */}
        {showNegativeIssues && (
          <div className="q-card">
            <div className="q-head">
              <div className="q-num">6</div>
              <div className="q-text">
                <div className="q-label">What went wrong? (optional)</div>
                <div className="q-hint">Select any that apply — helps us triage and fix problems</div>
              </div>
            </div>
            <div className="issue-list">
              {ISSUE_OPTIONS.map((opt) => (
                <label key={opt} className="issue-option">
                  <input
                    type="checkbox"
                    checked={issues.includes(opt)}
                    onChange={() => toggleIssue(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Contact opt-in (only when rating 1 or 2) */}
        {showContactOptIn && (
          <div className="q-card contact-optin-card">
            <div className="q-head">
              <div className="q-num">{showNegativeIssues ? 7 : 6}</div>
              <div className="q-text">
                <div className="q-label">We'd like to help put things right</div>
                <div className="q-hint">Optional — only if you want a follow-up</div>
              </div>
            </div>
            <label className="contact-optin">
              <input
                type="checkbox"
                checked={contactOptIn}
                onChange={(e) => setContactOptIn(e.target.checked)}
              />
              <span>I'd like to be contacted to help resolve this issue</span>
            </label>
            {contactOptIn && (
              <div className="contact-email-wrap">
                <input
                  type="email"
                  className={`survey-input ${emailError ? "survey-input--error" : ""}`}
                  placeholder="Your email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "contact-email-error" : undefined}
                />
                {emailError && (
                  <p id="contact-email-error" className="contact-email-error" role="alert">
                    {emailError}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Comments */}
        <div className="q-card">
          <div className="q-head">
            <div className="q-num">{showContactOptIn ? 8 : 6}</div>
            <div className="q-text">
              <div className="q-label">
                Any final thoughts you'd like to share?
                <span className="q-optional">Optional</span>
              </div>
              <div className="q-hint">
                A compliment, concern, or suggestion — all are welcome
              </div>
            </div>
          </div>
          <textarea
            className="survey-textarea"
            placeholder="Tell us about your experience in your own words..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <div className="submit-card">
          <div className="submit-note">
            🔒 Your responses are encrypted and completely confidential
          </div>
          <button
            type="button"
            className="submit-btn"
            onClick={handleSubmit}
            disabled={submitting || !canSubmit}
          >
            {submitting ? (
              <span className="submit-loader">
                <PulseLoader color="#fff" size={10} />
              </span>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </div>
        {errorMsg && <div className="status-msg">{errorMsg}</div>}
          </div>
        </div>
      </div>

      {submitting && (
        <div className="submit-loading-overlay" aria-live="polite" aria-busy="true">
          <PulseLoader color="#fff" size={14} />
          <p className="submit-loading-text">Submitting your feedback...</p>
        </div>
      )}

      <div className="black-strip" aria-hidden="true" />
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-visit">
            <h3 className="footer-heading">Visit Us (Milton Keynes)</h3>
            <p className="footer-store-name">WATCHO – The Watch & Clock Shop</p>
            <p className="footer-address">{WATCHO_ADDRESS}</p>
            <a
              href={WATCHO_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-directions"
            >
              Get Directions
            </a>
          </div>
          <div className="footer-contact">
            <a href={`tel:${WATCHO_PHONE}`} className="footer-phone">
              {CHAT_ICON_SVG}
              <span>{WATCHO_PHONE_DISPLAY}</span>
            </a>
            <a
              href={WATCHO_WEBSITE}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-chat"
              aria-label="Chat or visit website"
            >
              {CHAT_ICON_SVG}
              <span>Visit watcho.co.uk</span>
            </a>
          </div>
        </div>
      </footer>

      {showSuccess && (
        <div className="success-overlay show">
          <div className="success-box">
            <button
              type="button"
              className="success-close"
              onClick={closeSuccess}
              aria-label="Close"
            >
              ×
            </button>
            <div className="success-icon">✓</div>
            <div className="success-title">Thank You!</div>
            <div className="success-divider" />
            <p className="success-msg">
              Your feedback has been received and shared with our team. As a
              token of our appreciation, here's an exclusive discount for your
              next order:
            </p>
            <div className="discount-row">
              <div className="discount-box">{DISCOUNT_CODE}</div>
              <button
                type="button"
                className="discount-copy-btn"
                onClick={copyDiscountCode}
              >
                {copiedCode ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="discount-note">
              10% off your next purchase · Valid for 30 days
            </div>
            <div className="success-divider" />
            <p className="success-msg" style={{ fontSize: 12, margin: 0 }}>
              Thank you for trusting WATCHO. We look forward to serving you
              again.
            </p>
          </div>
        </div>
      )}

      {showErrorScreen && (
        <div className="error-overlay show" role="alert">
          <div className="error-box">
            <button
              type="button"
              className="error-close"
              onClick={closeErrorScreen}
              aria-label="Close"
            >
              ×
            </button>
            <div className="error-icon" aria-hidden="true">
              ⚠
            </div>
            <div className="error-title">Something went wrong</div>
            <p className="error-msg">
              We couldn't send your feedback right now. Please check your
              connection and try again.
            </p>
            <button
              type="button"
              className="error-retry-btn"
              onClick={closeErrorScreen}
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
