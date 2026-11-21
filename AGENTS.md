# Repository Guidelines

## Stack and Module Map

ShopLedger uses Node.js, CommonJS, and Express. `server.js` creates the app and mounts API routes. `routes/` contains product, order, customer, and report endpoints; `lib/` contains pricing, inventory, order, ledger, tax, coupon, invoice, date, store, and report logic. `public/` holds the HTML, CSS, and browser JavaScript. `config.js` contains app configuration, and `data/db.json` is the JSON data store.

## Commands

- `npm start` starts the server (`PORT` overrides the default port 3000).
- `npm test` is currently a placeholder that exits with an error; no test runner is configured.

## Change Rules

- Before changing behavior, write characterization tests that capture the current behavior.
- Change only the module the ticket is about; avoid unrelated edits.
- Tests must never read or write `data/db.json`.
- Do not add dependencies.
