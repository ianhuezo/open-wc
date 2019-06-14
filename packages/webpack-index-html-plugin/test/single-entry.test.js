const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const { expect } = require('chai');
const config = require('../demo/single-entry/webpack.config');

const outDir = path.join(__dirname, '../dist');
const indexOutput =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="app.889b20bcbef01fce0e59.js"></script></body></html>';

describe('single-entry', function singlEntry() {
  this.timeout(1000 * 60);

  beforeEach(() => {
    rimraf.sync(outDir);
  });

  it('works for a single entry application', done => {
    webpack(config, (err, stats) => {
      if (err) {
        throw err;
      }

      if (stats.hasErrors()) {
        throw stats.compilation.errors[0];
      }

      const { assets } = stats.compilation;
      const assetKeys = Object.keys(assets);

      assetKeys.forEach(key => {
        expect(assets[key].emitted).to.equal(true);
        expect(assets[key].existsAt).to.ok;
      });

      expect(assetKeys.length).to.equal(3);
      expect(assetKeys).to.include('index.html');

      expect(assetKeys.find(k => k.startsWith('app') && k.endsWith('.js'))).to.exist;
      expect(assetKeys.find(k => k.startsWith('1') && k.endsWith('.js'))).to.exist;

      expect(assets['index.html'].source()).to.equal(indexOutput);

      done();
    });
  });
});