/**
 * Retrieves the (hashed) asset map URL from the `<link>` tag that was injected
 * into the `<head>` by `index.js`.
 */
export default document
  .getElementById('ember-cli-resolve-asset-asset-map-path')
  .getAttribute('href');
