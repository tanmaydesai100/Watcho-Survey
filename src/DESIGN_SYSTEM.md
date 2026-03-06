# WATCHO Design System

Extracted from [watcho.co.uk](https://www.watcho.co.uk/) for use across WATCHO pages (e.g. post-purchase survey, review forms). Apply by importing `design-system.css` and using the CSS variables or utility classes below.

---

## Fonts

| Token / usage | Value |
|---------------|--------|
| **Sans** | `"Lato"` — body text, UI, labels |
| **Serif** | `"Playfair Display"` — headings, logo, product names |

**Load in `index.html`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,300&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
```

---

## Color palette

| Token | Hex | Use |
|-------|-----|-----|
| `--watcho-red` | `#c41e3a` | Primary CTA, accents, required asterisk |
| `--watcho-red-dark` | `#a01830` | Hover states |
| `--watcho-red-light` | `#f5e6e9` | Backgrounds, pills, highlights |
| `--watcho-navy` | `#1a1a2e` | Headings, logo, dark UI |
| `--watcho-charcoal` | `#333333` | Body text |
| `--watcho-mid-grey` | `#666666` | Secondary text, hints |
| `--watcho-light-grey` | `#999999` | Captions, meta |
| `--watcho-border` | `#e0e0e0` | Borders, dividers |
| `--watcho-white` | `#ffffff` | Backgrounds, cards |
| `--watcho-bg-soft` | `#f8f8f8` | Soft backgrounds |
| `--watcho-bg-warm` | `#fdf9f9` | Hero / warm sections |
| `--watcho-success-bg` | `#e8f5e9` | Success badges |
| `--watcho-success-text` | `#2e7d32` | Success text |

---

## Typography scale

| Variable | Size | Use |
|----------|------|-----|
| `--watcho-text-xs` | 11px | Meta, tiny labels |
| `--watcho-text-sm` | 12px | Captions, buttons |
| `--watcho-text-base` | 14px | Body default |
| `--watcho-text-md` | 16px | Lead / intro |
| `--watcho-text-lg` | 18px | Product names, card titles |
| `--watcho-text-xl` | 19px | Section titles |
| `--watcho-text-2xl` | 22px | Subheadings |
| `--watcho-text-3xl` | 26px | Logo, display |
| `--watcho-text-4xl` | 36px | Success / modal title |
| `--watcho-text-hero` | clamp(32px, 5vw, 56px) | Hero headline |

**Weights:** `--watcho-font-light` (300), `--watcho-font-regular` (400), `--watcho-font-medium` (600), `--watcho-font-bold` (700).

**Letter-spacing:** `--watcho-tracking-tight` through `--watcho-tracking-widest` (0.02em–0.22em).

---

## Spacing units

Use `--watcho-space-*` (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 80px) for padding and margin.

---

## Theme tokens (summary)

- **Radii:** `--watcho-radius-sm` (3px), `--watcho-radius-md` (4px), `--watcho-radius-lg` (6px), `--watcho-radius-xl` (20px).
- **Shadows:** `--watcho-shadow-sm`, `--watcho-shadow-md`, `--watcho-shadow-lg`.
- **Transitions:** `--watcho-transition-fast` (0.15s), `--watcho-transition-base` (0.2s), `--watcho-transition-slow` (0.4s).

---

## Applying to a new page

1. **Import the design system** (e.g. in `main.tsx`):
   ```ts
   import './design-system.css';
   ```

2. **Use variables** in your CSS:
   ```css
   .my-page {
     font-family: var(--watcho-font-sans);
     color: var(--watcho-charcoal);
     padding: var(--watcho-space-6);
   }
   .my-page h1 {
     font-family: var(--watcho-font-serif);
     color: var(--watcho-navy);
     font-size: var(--watcho-text-hero);
   }
   ```

3. **Or use utility classes** in JSX:
   ```jsx
   <h1 className="watcho-text-hero watcho-text-navy">Title</h1>
   <p className="watcho-text-body watcho-mb-6">Body copy.</p>
   <button className="watcho-btn-primary">Submit</button>
   ```

---

## Legacy survey tokens

The existing `WatchoSurvey.css` uses the same palette under shorter names (`--red`, `--navy`, etc.) scoped inside `.watcho-survey`. For new pages, prefer the `--watcho-*` variables from `design-system.css` so naming is consistent and the system is reusable.
