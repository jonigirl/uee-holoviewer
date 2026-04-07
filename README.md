# UEE Fleet Recognition Trainer
**v15.0**

A high-fidelity, web-based technical trainer designed for UEE Pilots to practice rapid identification of spacecraft signatures.

## 🚀 Features
* **60-Second Time Attack:** Identify as many hulls as possible before the link drops.
* **Holographic Interface:** Real-time 3D ship rendering with RSI-quality holographic aesthetics.
* **207 Ships:** Full fleet roster with smooth vertex normals on every model.
* **After-Action Report:** Accuracy, pilot rank, best streak, average response time, and fastest ID.
* **Keyboard Hotkeys:** Use `1-4` for rapid-response identification.
* **Zero-Lag Preloading:** Seamless transitions between targets using background caching.
* **Audio Feedback:** Rising chirp for correct IDs, descending buzz for mismatches, game-over sequence.
* **Mobile Friendly:** Fully playable on phone browsers.
* **Correct Answer Reveal:** Wrong answers highlight the correct option so you can learn.

## 🛠️ Setup & Local Development
1. Clone the repository.
2. Run `npm install` (required for the normals tool only — no runtime dependencies).
3. Open `index.html` via a local server (e.g. VS Code Live Server).
4. All 207 ship models are served from Cloudflare R2 — no local files needed.

### Tools (tools/)
- `tools/add-normals.mjs` — adds smooth vertex normals to GLB files using `@gltf-transform`.
- `tools/upload-r2-wrangler.mjs` — uploads processed GLBs to the R2 bucket. Requires `npx wrangler login` once.
- `tools/bump-version.mjs` — updates the version string across all project files.

> **Note:** Asset acquisition and processing tools are not included in this repository.
> Ship models are the property of Cloud Imperium Rights LLC — see Legal section below.

## 🛠️ Feedback & Improvements
Have a suggestion or found a bug? Please open an **Issue** on this repository! 
I am specifically looking for:
* Correcting ship names or manufacturer typos.
* Reporting broken or missing 3D models.
* Ideas for new game modes or UI enhancements.

By using GitHub Issues, we can track improvements publicly without needing to share private contact information.
## ⚖️ Legal & Copyright
**This is an unofficial Star Citizen fan work.**

* **Code & Design:** Distributed under the MIT License.
* **Assets & Trademarks:** All ship models, names, and Star Citizen related imagery are the sole property of **Cloud Imperium Rights LLC** and the **Cloud Imperium Group**. 

This project is not endorsed by or affiliated with Cloud Imperium or Roberts Space Industries. It is created under the [RSI Fan Use Policy](https://robertsspaceindustries.com/tos#fan_use_policy). No profit is being made from this project.

## 📜 License
Internal logic and stylesheets are licensed under the **MIT License**. See below:

Copyright (c) 2026 Joni Hayes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files... (etc)