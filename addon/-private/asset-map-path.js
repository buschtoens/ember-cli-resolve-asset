/**
 * Retrieves the (hashed) asset map URL from the `<link>` tag that was injected
 * into the `<head>` by `index.js`.
 */
export default (() => {
  if (typeof FastBoot === 'undefined') {
    const link = document.getElementById(
      'ember-cli-resolve-asset-asset-map-path'
    );
    if (link) return link.getAttribute('href');
  }
  return null;
})();
