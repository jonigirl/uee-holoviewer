# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Atkinson Hyperlegible as default font loaded from CDN; OpenDyslexic opt-in toggle with localStorage persistence
- `#font-toggle-btn` accessible button with `aria-pressed` state
- `.sr-only` utility class for screen-reader-only content

### Fixed

- Accessible label for callsign input (WCAG F1)
- `autocomplete="username"` on callsign input (was `off`)
- Removed `text-transform: uppercase` from body text (retained on specific sci-fi UI labels)
- Removed `overflow: hidden` from body (prevented scroll on small viewports)
- Removed CSS grid background pattern and `body::before` scanline overlay (visual noise)
- Removed `clip-path` from buttons; replaced with `border-radius: 2px`
- Removed decorative `::before` corner brackets from overlay elements
- Softened `textFlicker` and `timerUrgent` animations for reduced motion sensitivity

## [Earlier]

### Added

- RSI Holoviewer-style visual overhaul: HUD styling, hotkey badges, summary screen
- Ship models served from Cloudflare R2
- Audio: correct-answer chirp, wrong-answer buzz, countdown ticks, game-over sequence
- Stats tracking: best streak, average response time, fastest ID on summary screen
- Reveal correct answer button on wrong guess
- Footer with GitHub issues link
- Beta ribbon watermark

### Fixed

- Mismatched display names for Drake Shiv and Greycat STV
- Mobile layout fills full viewport
- CSP headers for model-viewer and Draco decoder
- Prevent last ship repeating on pool reshuffle
- Smooth vertex normals on all GLB ship models
