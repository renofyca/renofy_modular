# Upload and preview

Extract the ZIP and upload its contents directly to the root of a separate preview repository (for example `renofy-v2-preview`). Include index.html, css/, js/, images/, docs/, README.md, and .nojekyll.

Enable GitHub Pages in Settings → Pages → Deploy from a branch → main → / (root).

For that example repository, preview at https://renofyca.github.io/renofy-v2-preview/.

All local resource paths are relative, so the site supports a repository subpath. There is no CNAME file; domain mapping remains a later step. Uploading this package to an existing production branch may publish it immediately through that repository's current Pages configuration.

Local preview: run `python3 -m http.server 8000` from this directory and open http://localhost:8000/.

Contact buttons retain the existing hello@renofy.ca email links. The cinematic film section retains the supplied image fallback because no video was supplied.
