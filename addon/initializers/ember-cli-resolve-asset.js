import { load } from '../-private/asset-map-loader';

/**
 * While we do preload the asset map already, we still need to pipe it through
 * `ember-fetch`, which requires some CPU time. So we kick off the loading
 * process as early as possible.
 *
 * Besides that, not all browsers support preloading via `<link>` tags yet.
 *
 * We intentionally do not defer app readiness.
 */
export function initialize() {
  load();
}

export default { initialize };
