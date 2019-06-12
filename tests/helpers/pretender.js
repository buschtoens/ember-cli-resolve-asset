import Pretender from 'pretender';

export default function setupPretender(hooks, ...args) {
  hooks.beforeEach(function() {
    this.pretender = new Pretender(...args);
  });

  hooks.afterEach(function() {
    this.pretender.shutdown();
  });
}
