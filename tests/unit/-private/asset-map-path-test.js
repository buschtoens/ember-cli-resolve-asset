import { module, test } from 'qunit';

import privateAssetMapPath from 'ember-cli-resolve-asset/-private/asset-map-path';

module('Unit | -private/asset-map-path', function () {
  test('`privateAssetMapPath` module', function (assert) {
    assert.strictEqual(typeof privateAssetMapPath, 'string', 'is a string');
    assert.ok(
      privateAssetMapPath.startsWith('/assets/assetMap-'),
      'starts with `/assets/assetMap-`'
    );
    assert.ok(privateAssetMapPath.endsWith('.json'), 'ends with `.json`');
  });

  test('<link> tag', function (assert) {
    const link = document.getElementById(
      'ember-cli-resolve-asset-asset-map-path'
    );

    assert.ok(
      link instanceof HTMLLinkElement,
      '`<link id="ember-cli-resolve-asset-asset-map-path">` tag exists'
    );

    for (const [name, value] of Object.entries({
      rel: 'preload',
      as: 'fetch',
      type: 'application/json',
      crossorigin: 'anonymous'
    })) {
      assert.strictEqual(
        link.getAttribute(name),
        value,
        `\`${name}\` attribute is \`${value}\``
      );
    }
  });
});
