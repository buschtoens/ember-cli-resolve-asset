/* global require */

import { module, test } from 'qunit';

const moduleName = 'ember-cli-resolve-asset/-private/asset-map-loader';

module('Unit | -private/asset-map-loader', function(hooks) {
  let assetMap;
  let load;
  hooks.beforeEach(() => {
    require.unsee(moduleName);
    ({ assetMap, load } = require(moduleName));
  });

  test('`assetMap` & `load`', async function(assert) {
    assert.deepEqual(
      assetMap,
      {
        assets: null,
        prepend: null,
        enabled: null
      },
      '`assetMap` is filled with empty values'
    );

    const promise = load();
    assert.ok(promise instanceof Promise, '`load` returns a Promise');

    assert.deepEqual(
      assetMap,
      {
        assets: null,
        prepend: null,
        enabled: null
      },
      '`assetMap` is still empty immediately after calling `load`'
    );

    const promiseReturnValue = await promise;

    assert.strictEqual(
      assetMap,
      promiseReturnValue,
      '`assetMap` and return value of `load` are equal'
    );

    assert.strictEqual(assetMap.enabled, true, '`assetMap.enabled` is `true`');
    assert.strictEqual(
      typeof assetMap.prepend,
      'string',
      '`assetMap.prepend` is a string'
    );
    assert.strictEqual(
      typeof assetMap.assets,
      'object',
      '`assetMap.assets` is an object'
    );
    assert.ok(
      Object.entries(assetMap.assets).length > 0,
      '`assetMap.assets` is not empty'
    );
  });

  test('Calling `load` multiple times', async function(assert) {
    assert.deepEqual(
      assetMap,
      {
        assets: null,
        prepend: null,
        enabled: null
      },
      '`assetMap` is filled with empty values'
    );

    const promiseA = load();
    assert.ok(promiseA instanceof Promise, '`load` returns a Promise');
    const promiseB = load();
    assert.ok(
      promiseB instanceof Promise,
      '`load` returns a Promise, while it is still pending'
    );

    assert.strictEqual(promiseA, promiseB, '`load` returns the same Promise');

    await promiseA;

    const promiseC = load();
    assert.ok(
      promiseB instanceof Promise,
      '`load` returns a Promise, after the it is resolved'
    );
    assert.strictEqual(promiseA, promiseC, '`load` returns the same Promise');
  });
});
