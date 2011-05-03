var path = require('path'),
    sys = require('sys'),
    argv = require('optimist').argv;

require.paths.unshift(path.join(__dirname, '../lib'), path.join(__dirname, '../lib/node'));

var opt = {};

if (argv._[0] && ~['.mml', '.json', '.xml'].indexOf(path.extname(argv._))) {
  opt.file = argv._[0];
} else {
  sys.error("geode: please provide an input:\n" +
      "- mml or xml mapfile\n" +
      "- json map configuration");
  process.exit(1);
}

opt.port = argv.port || 8910;

require('geode').start(opt);
