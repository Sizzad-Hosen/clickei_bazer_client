# Responsive manual-test matrix

Automated source-contract tests cover the layout safeguards for these viewports:

`320×568`, `360×800`, `375×812`, `390×844`, `414×896`, `768×1024`, `820×1180`, `1024×768`, `1280×720`, `1366×768`, `1440×900`, `1536×864`, and `1920×1080`.

For browser sign-off, test `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/search`, `/checkout`, `/order`, `/profile`, `/wishList`, and all dashboard list/form routes. At each representative mobile, tablet, laptop, and desktop width:

1. Confirm `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
2. Open and close the navbar, service sidebar, dashboard drawer, cart drawer, dialogs, selects, and dropdowns with pointer and keyboard.
3. Verify tables scroll horizontally without clipping actions.
4. Check long names, email addresses, prices, validation errors, empty results, failed requests, and loading states.
5. Repeat at 80%, 100%, 125%, and 200% zoom, including portrait and landscape where supported.
6. Verify focus order, visible focus, Escape dismissal, mobile keyboard behavior, and that fixed contact controls do not cover primary actions.

Browser screenshots remain a manual requirement whenever the in-app browser runtime is unavailable.
