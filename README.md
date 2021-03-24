# ember-cli-resolve-asset

[![Build Status](https://travis-ci.org/buschtoens/ember-cli-resolve-asset.svg)](https://travis-ci.org/buschtoens/ember-cli-resolve-asset)
[![npm version](https://badge.fury.io/js/ember-cli-resolve-asset.svg)](http://badge.fury.io/js/ember-cli-resolve-asset)
[![Download Total](https://img.shields.io/npm/dt/ember-cli-resolve-asset.svg)](http://badge.fury.io/js/ember-cli-resolve-asset)
[![Ember Observer Score](https://emberobserver.com/badges/ember-cli-resolve-asset.svg)](https://emberobserver.com/addons/ember-cli-resolve-asset)  
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![dependencies](https://img.shields.io/david/buschtoens/ember-cli-resolve-asset.svg)](https://david-dm.org/buschtoens/ember-cli-resolve-asset)
[![devDependencies](https://img.shields.io/david/dev/buschtoens/ember-cli-resolve-asset.svg)](https://david-dm.org/buschtoens/ember-cli-resolve-asset)

Imperatively resolves assets fingerprinted by
[**`broccoli-asset-rev`**][broccoli-asset-rev], which allows you to even resolve
_interpolated_ paths.

## Installation

```
ember install ember-cli-resolve-asset
```

If you want to use this in one of your addons, the consuming host application
will also need to install `ember-cli-resolve-asset`. If this not a case, a
helpful build error will be shown.

### Setup

The following configuration in your `ember-cli-build.js` is required for this
addon to work correctly.

```js
const app = new EmberAddon(defaults, {
  fingerprint: {
    enabled: true, // If false, this addon is disabled also.
    generateAssetMap: true, // Required.
    
    // Recommended to prevent caching issues, although currently for it work you will need to use a fork of 
    // "broccoli-asset-rev": "https://github.com/joankaradimov/broccoli-asset-rev#fix-duplicate-generation"
    fingerprintAssetMap: true 
  },

  'ember-fetch': {
    preferNative: true // Recommended to enable faster preloading for browsers that support it.
  }
});
```

- [`broccoli-asset-rev` options](https://github.com/rickharrison/broccoli-asset-rev#options)
- [`ember-fetch` options](https://github.com/ember-cli/ember-fetch#allow-native-fetch)

## Usage

### Utils

#### `resolveAsset`

**`async resolveAsset(path: string, withoutPrepend = false): Promise<string>`**

Asynchronously resolves the given `path` from the asset map.

If the asset map is not loaded yet, this function will wait for it.
If loading the asset map fails, the returned `Promise` will reject.
If the path is not listed in the asset map, the returned `Promise` will reject.

```ts
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import resolveAsset from 'ember-cli-resolve-asset';

export default class ApplicationRoute extends Route {
  @service intl;
  @service language;

  async beforeModel() {
    const preferredLanguage = this.language.getPreferredLanguage();
    const translationsPath = await resolveAsset(
      `translations/${preferredLanguage}.json`
    );
    const translations = await fetch(translationsPath);

    this.intl.addTranslations(preferredLanguage, await translations.json());
    this.intl.setLocale(preferredLanguage);
  }
}
```

#### `resolveAssetSync`

**`resolveAssetSync(path: string, withoutPrepend = false): string`**

Synchronous version of [`resolveAsset`](#resolveAsset).

Synchronously resolves the given `path` from the asset map.

If the asset map is not loaded yet, this function will throw.
If the path is not listed in the asset map, this function will throw.

Usage of this function is discouraged in favor of `resolveAsset`. Only use this
function, if using the async version is not feasible and if you can guarantee,
that [`load`](#load) ran to completion beforehand.

```ts
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import {
  resolveAssetSync,
  load as loadAssetMap
} from 'ember-cli-resolve-asset';

export default class ApplicationRoute extends Route {
  @service intl;
  @service language;

  async beforeModel() {
    await loadAssetMap();

    const preferredLanguage = this.language.getPreferredLanguage();
    const translationsPath = resolveAssetSync(
      `translations/${preferredLanguage}.json`
    );
    const translations = await fetch(translationsPath);

    this.intl.addTranslations(preferredLanguage, await translations.json());
    this.intl.setLocale(preferredLanguage);
  }
}
```

#### `load`

**`async load(): Promise<void>`**

This function returns a `Promise` that resolves once the asset map was loaded
successfully. Repeatedly calling this function returns the same `Promise`. After
this `Promise` has resolved, you can use
[`resolveAssetSync`](#resolveAssetSync).

This function is called automatically by an initializer, to start the loading of
the asset map as soon as possible. This means there is no direct need for you to
call this function yourself, unless you want to await the asset map explicitly.

## Related Projects

- [**`broccoli-asset-rev`**][broccoli-asset-rev]: The ember-cli addon that
  performs the fingerprinting and generates the asset map.
- [**`ember-fetch`**][ember-fetch]: Used by this addon to asynchronously load
  the asset map.
- [**`ember-cli-ifa`**][ember-cli-ifa]: The original inspiration for this addon.
  I was dissatisfied with the technical implementation, the bugs it caused and
  current state of maintenance, which is why I created this addon instead.

[broccoli-asset-rev]: https://github.com/rickharrison/broccoli-asset-rev
[ember-fetch]: https://github.com/ember-cli/ember-fetch
[ember-cli-ifa]: https://github.com/RuslanZavacky/ember-cli-ifa
