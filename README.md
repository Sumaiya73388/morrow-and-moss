# Morrow & Moss

> *Thoughtful everyday objects for slower, softer living.*

A minimalist, editorial e-commerce storefront designed around calm typography, tactile CSS art, and smooth client-side shopping interactions. Built entirely from scratch without frameworks.

[**View Live Demo ↗**](https://Sumaiya73388.github.io/morrow-and-moss/)

---

## Features

- **Curated Filtering & Live Search** — Filter products by category (*Home & living*, *Slow rituals*, *Little extras*, *Wearables*), sort by price or rating, or search instantly with the `⌘ K` keyboard shortcut.
- **Interactive Shopping Bag** — Slide-out cart drawer with live item counts, dynamic subtotal calculation, and a real-time complimentary shipping progress tracker ($75 threshold).
- **Pure CSS Editorial Illustration** — Custom hero artwork (*The Sunday Vessel*) crafted using layered CSS shapes, shadows, and composition rather than static images.
- **Accessible & Semantic Architecture** — Built with ARIA live regions, skip-to-content navigation, modal focus management, and keyboard-friendly controls.
- **PWA-Ready** — Includes an SVG brand mark and `manifest.json` configuration.

---

## Project Structure

```text
morrow-and-moss/
├── index.html      # Semantic markup, SVG iconography, and modal/drawer templates
├── style.css       # Editorial layout, responsive grid, and pure CSS hero art
├── app.js          # Filtering, sorting, search shortcut, and cart state logic
├── icon.svg        # Custom botanical brand mark
├── manifest.json   # Web app manifest for theme & icon metadata
└── README.md       # Project documentation
