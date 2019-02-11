# ember-cli-resolve-asset

[![Build Status](https://travis-ci.org/buschtoens/ember-cli-resolve-asset.svg)](https://travis-ci.org/buschtoens/ember-cli-resolve-asset)
[![npm version](https://badge.fury.io/js/ember-cli-resolve-asset.svg)](http://badge.fury.io/js/ember-cli-resolve-asset)
[![Download Total](https://img.shields.io/npm/dt/ember-cli-resolve-asset.svg)](http://badge.fury.io/js/ember-cli-resolve-asset)
[![Ember Observer Score](https://emberobserver.com/badges/ember-cli-resolve-asset.svg)](https://emberobserver.com/addons/ember-cli-resolve-asset)
[![Ember Versions](https://img.shields.io/badge/Ember.js%20Versions-%5E2.18%20%7C%7C%20%5E3.0-brightgreen.svg)](https://travis-ci.org/buschtoens/ember-cli-resolve-asset)
[![ember-cli Versions](https://img.shields.io/badge/ember--cli%20Versions-%5E2.13%20%7C%7C%20%5E3.0-brightgreen.svg)](https://travis-ci.org/buschtoens/ember-cli-resolve-asset)
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

### Setup

The following configuration in your `ember-cli-build.js` is required for this
addon to work correctly.

```js
const app = new EmberAddon(defaults, {
  fingerprint: {
    enabled: true, // If false, this addon is disabled also.
    generateAssetMap: true, // Required.
    fingerprintAssetMap: true // Recommended to prevent caching issues.
  },

  'ember-fetch': {
    preferNative: true // Recommended to enable faster preloading for browsers that support it.
  }
});
```

- [`broccoli-asset-rev` options](https://github.com/rickharrison/broccoli-asset-rev#options)
- [`ember-fetch` options](https://github.com/ember-cli/ember-fetch#allow-native-fetch)

## Usage

### Example

```ts
import Route from '@ember/routing/route';
import { inject as service } from '@ember-decorators/service';
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
