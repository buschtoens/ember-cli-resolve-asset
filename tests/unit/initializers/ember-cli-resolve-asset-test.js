import { settled } from '@ember/test-helpers';
import { module, test } from 'qunit';

import Application from '@ember/application';
import { run } from '@ember/runloop';

import { assetMap } from 'ember-cli-resolve-asset/-private/asset-map-loader';

import initializer from 'dummy/initializers/ember-cli-resolve-asset';

module('Unit | Initializer | ember-cli-resolve-asset', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = Application.extend();
    this.TestApplication.initializer(initializer);

    this.application = this.TestApplication.create({ autoboot: false });
  });

  hooks.afterEach(function () {
    run(this.application, 'destroy');
  });

  test('it works', async function (assert) {
    await settled();

    assert.deepEqual(
      assetMap,
      {
        assets: null,
        prepend: null,
        enabled: null
      },
      '`assetMap` is filled with empty values'
    );

    await this.application.boot();

    assert.deepEqual(
      assetMap,
      {
        assets: null,
        prepend: null,
        enabled: null
      },
      '`assetMap` is filled with empty values'
    );

    await settled();

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
});
