import { DEBUG } from '@glimmer/env';
import fetch from 'fetch';

import assetMapPath from './asset-map-path';

let promise;

export const assetMap = {
  assets: null,
  prepend: null,
  enabled: null
};

async function fetchAssetMap() {
  if (assetMapPath) {
    const response = await fetch(assetMapPath);
    const json = await response.json();
    assetMap.assets = DEBUG ? Object.freeze(json.assets) : json.assets;
    assetMap.prepend = json.prepend;
    assetMap.enabled = true;
  } else {
    assetMap.enabled = false;
  }
  return assetMap;
}

// Not using `async` here so that `load` can return the same `Promise` instance
// with each invocation.
export /* async */ function load() {
  if (promise) return promise;
  promise = fetchAssetMap();
  return promise;
}
