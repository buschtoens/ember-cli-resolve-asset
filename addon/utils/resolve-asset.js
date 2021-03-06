import { DEBUG } from '@glimmer/env';

import config from 'ember-get-config';

import { assetMap, load } from '../-private/asset-map-loader';

/**
 * Returns the resolved asset path for the given input `path`. If the asset is
 * not listed in the asset map, this function will throw an error.
 *
 * This function assumes, that the asset map has already been loaded.
 *
 * @param {string} path
 * @param {boolean} withoutPrepend
 */
function getAssetPath(path, withoutPrepend = false) {
  if (assetMap.enabled === false) {
    return `${config.rootURL}${path}`;
  }

  const resolved = assetMap.assets[path];

  if (!resolved) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.info(
        `ember-cli-resolve-asset: List of known asset paths:`,
        Object.keys(assetMap.assets)
      );
    }

    throw new Error(
      `ember-cli-resolve-asset: Could not find '${path}' in the asset map.`
    );
  }

  if (withoutPrepend) return `${config.rootURL}${resolved}`;

  return `${assetMap.prepend || config.rootURL}${resolved}`;
}

/**
 * Asynchronously resolves the given `path` from the asset map.
 *
 * If the asset map is not loaded yet, this function will wait for it.
 * If loading the asset map fails, the returned `Promise` will reject.
 * If the path is not listed in the asset map, the returned `Promise` will
 * reject.
 *
 * @param {string} path
 * @param {boolean} withoutPrepend
 */
export async function resolveAsset(path, withoutPrepend = false) {
  await load();
  return getAssetPath(path, withoutPrepend);
}

export default resolveAsset;

/**
 * Synchronous version of `resolveAsset`.
 *
 * Synchronously resolves the given `path` from the asset map.
 *
 * If the asset map is not loaded yet, this function will throw.
 * If the path is not listed in the asset map, this function will throw.
 *
 * @param {string} path
 * @param {boolean} withoutPrepend
 */
export function resolveAssetSync(path, withoutPrepend = false) {
  if (!assetMap.assets) {
    throw new Error(
      `ember-cli-resolve-asset: Could not resolve '${path}', because the asset map is not loaded yet. You might want to use the async 'resolveAsset' instead.`
    );
  }

  return getAssetPath(path, withoutPrepend);
}
