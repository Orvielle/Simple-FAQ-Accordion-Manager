# FAQ Desk — Accordion Manager

A simple, self-contained FAQ accordion built with plain HTML, CSS, and JavaScript. Visitors can browse questions in an accordion list, and you can add, edit, or delete entries directly from the page. Entries are saved in the browser's local storage, so your list persists between visits on the same device.

## Files

| File         | Purpose                                                                 |
|--------------|--------------------------------------------------------------------------|
| `index.html` | Page structure: masthead, "New entry" form, and the accordion list       |
| `style.css`  | Visual design — paper/index-card theme, layout, and accordion styling    |
| `script.js`  | Logic for adding, editing, deleting, expanding/collapsing, and saving FAQs |

## Getting started

1. Keep all three files in the same folder (the HTML links to the CSS and JS by relative path).
2. Open `index.html` in any modern web browser. No build step, server, or dependencies required.

## How it works

- **Add a question:** Fill in the "Question" and "Answer" fields on the left and click **Add to list**. The new entry appears at the top of the accordion.
- **Expand / collapse:** Click any question to reveal its answer. Opening one entry automatically closes any other open entry.
- **Edit an entry:** Open the entry, click **Edit**, update the text, then **Save changes** (or **Cancel** to discard).
- **Delete an entry:** Open the entry and click **Delete** to remove it permanently.
- **Saving:** All changes are written to `localStorage` under the key `faq-desk-entries`. Data stays on the device/browser it was created in — it is not synced anywhere.

## Customizing

- **Starter content:** Edit the `defaultFaqs()` function in `script.js` to change the questions shown the first time the page loads (before any user data is saved).
- **Colors and fonts:** Adjust the CSS variables at the top of `style.css` (`--paper`, `--ink`, `--stamp`, `--serif`, `--sans`, etc.) to match your own branding.
- **Single vs. multiple open panels:** By default only one accordion item can be open at a time. To allow multiple open panels simultaneously, remove the "close other open items" block inside `toggleItem()` in `script.js`.
- **Reset saved data:** Clear the `faq-desk-entries` key from your browser's local storage (or open the page in a private/incognito window) to start fresh with the default entries.

## Browser support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript and local storage to be enabled for adding, editing, deleting, and persisting entries.
