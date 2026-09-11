# Renofy — modular static website

The current cinematic design, content, images, responsive rules, and animation logic are preserved. Folder organization follows renofyca/Renofy-website-v2 (reference commit cfb06b829c2f034d6197388e7ccc47a17117149e).

- `index.html`: page markup and content
- `css/style.css`: all styling, animation keyframes, and responsive rules
- `js/main.js`: scroll animations, reveal effects, and section highlighting
- `js/navigation.js`: mobile menu, Escape handling, and resize behavior
- `images/`: supplied image assets
- `docs/deployment.md`: preview and upload instructions

No build tools or package installation are required. Keep the two scripts in their existing order: navigation uses the selector helper from main.js.

This is a complete standalone package. It follows the reference repository's folder conventions without importing its older visual theme or unrelated demo pages.
