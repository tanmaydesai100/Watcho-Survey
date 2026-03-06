# WATCHO Post-Purchase Survey

A professional, mobile-friendly post-purchase feedback survey for **WATCHO – The Watch & Clock Shop**. Built with React, TypeScript, and Vite, it collects structured feedback and optional follow-up data while keeping the experience concise and on-brand.

---

## Overview

This single-page survey is designed to be sent to customers after delivery (e.g. via email or order confirmation) with optional context (order ID, email, product) in the URL. Responses can be submitted to a Google Apps Script endpoint and stored in a spreadsheet for analysis.

---

## Features

- **Core questions (required)**  
  Overall experience rating, product satisfaction, delivery experience, and NPS (0–10).

- **Optional questions**  
  “What stood out?” (multi-select), “What went wrong?” (for low ratings), contact opt-in with email, and free-text comments.

- **Smart flow**  
  Issue checkboxes and contact opt-in only appear when the overall rating is 1 or 2.

- **Survey link context**  
  Query parameters (`order_id`, `email`, `product`, `product_meta`, etc.) are read from the URL and sent with the submission so you can attribute feedback to orders and customers.

- **UX**  
  Progress indicator, loading state (PulseLoader), success overlay with discount code and copy button, and an error overlay with retry when the server fails.

- **Validation**  
  Email format validated when contact opt-in is checked; submit is disabled until required fields (and valid email when opt-in) are complete.

- **Footer**  
  Visit address (Milton Keynes), Get Directions link, phone number, and link to watcho.co.uk.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** (build and dev server)
- **react-spinners** (PulseLoader for submit state)

Styles are scoped under `.watcho-survey` in `WatchoSurvey.css` and use a small design system (`design-system.css`) for colours and typography.

---

## Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm or yarn

---

## Installation

```bash
git clone <repository-url>
cd watcho-survey
npm install
```

---

## Configuration

Before deploying, set these in `src/components/WatchoSurvey.tsx` (see constants at the top of the file). Optional: copy `.env.example` to `.env.local` if you later add env-based config.

| Constant | Description |
|----------|-------------|
| `SCRIPT_URL` | Your Google Apps Script web app URL (POST). Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with your deployed script URL. If left as placeholder, the app runs in **demo mode** (submit simulates success and logs payload to console). |
| `WATCHO_WEBSITE` | URL to redirect to when the user closes the success popup (e.g. `https://www.watcho.co.uk`). |
| `WATCHO_ADDRESS` | Store address shown in the footer. |
| `WATCHO_PHONE` / `WATCHO_PHONE_DISPLAY` | Phone number for `tel:` link and display. |
| `WATCHO_GOOGLE_MAPS_URL` | Google Maps link for “Get Directions”. |
| `DEMO_EMAIL` | Optional prefill for the contact email field when you have the customer’s email. |

---

## Development

```bash
npm run dev
```

Runs the app at `http://localhost:5173` (or the next available port).

---

## Build & Preview

```bash
npm run build
npm run preview
```

Output is in `dist/`. Serve `dist` with any static host (e.g. Vercel, Netlify, or your own server).

---

## Survey Link Parameters

When sending the survey to customers, you can add query parameters so each response is tied to an order/customer. All of these are optional; any extra params are also forwarded in the POST body.

| Parameter | Example | Use |
|-----------|---------|-----|
| `order_id` | `WTC-12345` | Order reference; shown as “Order #” and sent in the payload. |
| `email` | `customer@example.com` | Prefills contact email and is sent in the payload. |
| `product` | `Seiko Presage Cocktail Time` | Product name shown in the product panel and sent in the payload. |
| `product_meta` | `40MM \| Automatic` | Product meta line; shown and sent. |

**Example survey URL:**

```
https://your-survey-domain.com/?order_id=WTC-12345&email=customer@example.com&product=Seiko%20Presage&product_meta=40MM%20%7C%20Automatic
```

Your backend (e.g. Google Apps Script) should read these fields from the POST body and map them to columns in your sheet.

---

## Project Structure

```
watcho-survey/
├── public/
│   ├── favicon.svg       # WATCHO-branded favicon
│   └── watch-product.png # Product image (add your asset)
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Renders WatchoSurvey
│   ├── index.css         # Global baseline styles
│   ├── design-system.css # WATCHO theme tokens
│   ├── WatchoSurvey.css  # Survey-specific styles
│   ├── components/
│   │   ├── WatchoSurvey.tsx  # Main survey (state, submit, layout)
│   │   └── StarRating.tsx    # Reusable 1–5 star rating
│   └── DESIGN_SYSTEM.md  # Design token documentation
├── .editorconfig         # Editor formatting
├── .env.example          # Optional env vars template
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

---

## Backend (Google Apps Script)

The app sends a POST request with `FormData` to `SCRIPT_URL`. Your Apps Script should:

1. Parse the form fields (e.g. `timestamp`, `order_id`, `product`, `overall_rating`, `product_rating`, `delivery`, `standout`, `nps`, `issues`, `contact_ok`, `email`, `comments`, plus any link params).
2. Append a new row to your Google Sheet with these values.
3. Return a 200 response (optional; with `mode: "no-cors"` the client cannot read the response body).

Ensure the script is deployed as a web app (Execute as: Me, Who has access: Anyone) so the survey can POST from the browser.

---

## License

Private. For use by WATCHO.

---

## Support

For questions about this survey app, contact the development team or refer to the codebase and `DESIGN_SYSTEM.md` for styling and structure.
