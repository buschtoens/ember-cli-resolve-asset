import { DEBUG } from '@glimmer/env';
import fetch from 'fetch';
import assetMapPath from './asset-map-path';

let promise;

export const assetMap = {
  assets: null,
  prepend: null
};

export async function load() {
  if (promise) return promise;
  return (promise = fetchAssetMap());
}

async function fetchAssetMap() {
  const response = await fetch(assetMapPath);
  const json = await response.json();
  assetMap.assets = DEBUG ? Object.freeze(json.assets) : json.assets;
  assetMap.prepend = json.prepend;
  return assetMap;
}
