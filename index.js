'use strict';

/**
 * `broccoli-asset-rewrite` does not explicitly expose this default, so we need
 * to hard code it.
 *
 * @see https://github.com/rickharrison/broccoli-asset-rev/blob/087417f131020ea24b94b9b257c12e4d6080296d/lib/fingerprint.js#L150
 */
const DEFAULT_ASSET_MAP_PATH = 'assets/assetMap.json';

/**
 * This ID is added to the `<link>` tag that is injected into the head to
 * preload the asset map. The ID is later used in `asset-map-path.js` to get the
 * actual asset map path from the document.
 */
const LINK_ID = 'ember-cli-resolve-asset-asset-map-path';

const README_SETUP_URL =
  'https://github.com/buschtoens/ember-cli-resolve-asset#setup';

module.exports = {
  name: require('./package').name,

  /**
   * Remains `null` if the asset map generation and thus this addon is disabled.
   * Otherwise contains the _unhashed_ asset map path. It will be injected into
   * the `index.html` and then be rewritten by `broccoli-asset-map`.
   */
  assetMapPath: null,

  /**
   * Utility function to keep the generation of setup related error messages or
   * warnings DRY.
   *
   * @param {string} msg
   * @param {string} addonName
   * @param {string} configName
   */
  setupMessage(
    message,
    addonName = 'broccoli-asset-rev',
    configName = 'fingerprint'
  ) {
    return `The config for ${addonName} ('${configName}' in 'ember-cli-build.js') is incorrect.\n${message}\nRefer to the setup guide for more information: ${README_SETUP_URL}`;
  },

  /**
   * Throws an error and prepends the name of this addon.
   *
   * @param {string} msg
   */
  error(message) {
    throw new Error(`${this.name}: ${message}`);
  },

  /**
   * Prints a warning and prepend the name of this addon.
   *
   * @param {string} msg
   */
  warn(message) {
    this.ui.writeWarnLine(`${this.name}: ${message}`);
  },

  included(...args) {
    this._super && this._super(...args);

    if (this.app) {
      this.determineAssetMapPath();
    } else {
      this.checkIfInstalledAtRoot();
    }
  },

  /**
   * Invoked, if this instance of the addon is not a direct dependency of the
   * main project Ember app.
   *
   * Checks, whether the main project Ember app has this addon as a direct
   * dependency and throws a build error otherwise.
   */
  checkIfInstalledAtRoot() {
    if (!this.project.findAddonByName('ember-cli-resolve-asset')) {
      this.error(
        `'${this.parent.name}' uses '${this.name}', which requires you to also install it for your app.\nPlease run \`yarn add -D ${this.name}\` `
      );
    }
  },

  /**
   * Validates the config of `broccoli-asset-rev` (`fingerprint`) and determines
   * the effective asset map path and set it as `assetMapPath`.
   *
   * If the config is invalid, this method throws.
   *
   * If the config is valid, but disables fingerprinting, `assetMapPath` will
   * remain as `null`, indicating that this addon should also be disabled.
   */
  determineAssetMapPath() {
    const emberFetchOptions = this.app.options['ember-fetch'];
    if (!emberFetchOptions || !emberFetchOptions.preferNative) {
      this.warn(
        this.setupMessage(
          `'preferNative' is disabled. This breaks the early preloading of the asset map in evergreen browsers, that support '<link rel="preload">'.`,
          'ember-fetch',
          'ember-fetch'
        )
      );
    }

    const fingerprintOptions = this.app.options.fingerprint;

    if (typeof fingerprintOptions === 'undefined') {
      this.error(
        this.setupMessage(
          `The config is missing. This means that the default config will be used, which has 'generateAssetMap' disabled. We need it to be enabled.`
        )
      );
      return;
    }

    if (fingerprintOptions === false) {
      this.warn(
        this.setupMessage(
          `You have explicitly disabled it via the 'false' shorthand notation. This addon will have no effect now.`
        )
      );
      return;
    }

    if (!(fingerprintOptions instanceof Object)) {
      this.error(this.setupMessage(`You gave an invalid config.`));
      return;
    }

    if (!fingerprintOptions.generateAssetMap) {
      this.error(
        this.setupMessage(
          `'generateAssetMap' is disabled. We need it to be enabled.`
        )
      );
      return;
    }

    if (!fingerprintOptions.fingerprintAssetMap) {
      this.warn(
        this.setupMessage(
          `'fingerprintAssetMap' is disabled. We recommend that you enable it to prevent caching issues.`
        )
      );
    }

    if (!fingerprintOptions.enabled) return;

    // Use path from fingerprint config or default path, if not set.
    this.assetMapPath =
      fingerprintOptions.assetMapPath || DEFAULT_ASSET_MAP_PATH;
  },

  /**
   * Injects a `<link>` tag into the page `<head>` to preload the asset map as
   * early as possible as well as to provide the (hashed) asset map URL to the
   * runtime JS. The injected path is unhashed, but will be hashed by
   * `broccoli-asset-rev`, if `fingerprintAssetMap` is enabled.
   *
   * @param {string} type
   * @param {object} config
   */
  contentFor(type, config) {
    if (!this.assetMapPath || type !== 'head') return;

    return `<link rel="preload" href="${config.rootURL}${this.assetMapPath}" as="fetch" type="application/json" crossorigin="anonymous" id="${LINK_ID}">`;
  }
};
