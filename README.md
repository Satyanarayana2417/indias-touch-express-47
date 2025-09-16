# Venkat Express

This project was created by Shiva from Dream Team Services.

## How to run locally

Prerequisites: Node.js and npm installed.

1. Clone the repository:

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

If you need deployment help, contact Shiva at Dream Team Services.

## Prohibited Items Page

A dedicated `/prohibited-items` page has been added to clearly list categories of items that cannot be shipped via international courier (flammables, chemicals, weapons, biological risks, etc.).

Features:
- Categorized grid with concise reasons for restriction
- Compliance advisory section explaining rationale (IATA / customs / aviation safety)
- Call to action for contacting support if unsure
- Accessible semantics and responsive design consistent with existing site UI

Access:
- A prominent "Prohibited Items" emergency-style button (animated pulse) appears in both the desktop secondary navigation bar and the mobile horizontal category scroller.
- Clicking it navigates users directly to the page.

Styling:
- Custom Tailwind animations added (`attention-pulse`, `soft-blink`) in `tailwind.config.ts`.

Next Enhancements (optional):
- Add dynamic content management via an admin CMS area.
- Localize content for destination-specific regulations.
- Add search/filter within prohibited list.

