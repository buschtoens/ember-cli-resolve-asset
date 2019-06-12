/* eslint-disable no-shadow */
/* global require */

import { module, test } from 'qunit';

import assetMapPath from 'ember-cli-resolve-asset/-private/asset-map-path';
import config from 'ember-get-config';

import setupPretender from 'dummy/tests/helpers/pretender';

const loaderModuleName = 'ember-cli-resolve-asset/-private/asset-map-loader';
const resolverModuleName = 'ember-cli-resolve-asset/utils/resolve-asset';

module('Unit | Utility | resolve-asset', function(hooks) {
  let assetMapFixture = {};
  setupPretender(hooks, function() {
    this.get(assetMapPath, () => [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(assetMapFixture)
    ]);
  });

  let assetMap;
  let load;
  let resolveAsset;
  let resolveAssetSync;
  hooks.beforeEach(() => {
    require.unsee(loaderModuleName);
    require.unsee(resolverModuleName);
    ({ assetMap, load } = require(loaderModuleName));
    ({ resolveAsset, resolveAssetSync } = require(resolverModuleName));
  });

  function runTests({ name, prepend = '', prefix }) {
    module(name, function(hooks) {
      hooks.beforeEach(() => {
        assetMapFixture = {
          assets: {
            foo: 'bar'
          },
          prepend
        };
      });

      test('`resolveAssetSync`', async function(assert) {
        assert.strictEqual(assetMap.assets, null);

        assert.throws(
          () => resolveAssetSync('foo'),
          /ember-cli-resolve-asset: Could not resolve 'foo', because the asset map is not loaded yet. You might want to use the async 'resolveAsset' instead./,
          'throws an error, when the map is not loaded'
        );

        await load();

        assert.strictEqual(resolveAssetSync('foo'), `${prefix}bar`);

        assert.throws(
          () => resolveAssetSync('does-not-exist'),
          /ember-cli-resolve-asset: Could not find 'does-not-exist' in the asset map./,
          'throws an error, if the asset cannot be resolved'
        );
      });

      test('`resolveAsset`', async function(assert) {
        assert.strictEqual(assetMap.assets, null);

        // eslint-disable-next-line no-useless-concat
        const assetPath = 'foo';

        const promise = resolveAsset(assetPath);
        assert.ok(
          promise instanceof Promise,
          '`resolveAsset` returns a Promise'
        );

        const returnValue = await promise;
        assert.strictEqual(returnValue, `${prefix}bar`);

        await assert.rejects(
          resolveAsset('does-not-exist'),
          /ember-cli-resolve-asset: Could not find 'does-not-exist' in the asset map./,
          'throws an error, if the asset cannot be resolved'
        );
      });
    });
  }

  runTests({ name: 'without `prepend`', prefix: config.rootURL });
  runTests({ name: 'with `prepend`', prepend: 'qux/', prefix: 'qux/' });
});
