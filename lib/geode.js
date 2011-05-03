var express = require('express'),
    Tile = require('tilelive').Tile,
    path = require('path'),
    sys = require('sys'),
    fs = require('fs');

var geode = function(opt) {
    var app = express.createServer();
    var templates_dir = path.normalize(__dirname + '/../static/');
    var mapfile_dir = path.join(__dirname, 'tmp');

    var bootstrap = function() {
        try {
            fs.statSync(this.mapfile_dir);
        } catch (e) {
            sys.debug('Creating mapfile dir: ' + this.mapfile_dir);
            fs.mkdirSync(this.mapfile_dir, 0777);
        }
    }

    app.use(express.static(templates_dir + '/public'));

    app.get('/', function(req, res) {
        var t = t || fs.readFileSync(
            templates_dir + '/index.html',
            'utf-8');
        res.send(t);
    });

    app.get('/1.0.0/:layername/:z/:x/:y.*', function(req, res) {
        try {
            var tile = new Tile({
                scheme: 'tms',
                datasource: mapfile,
                language: language,
                xyz: [x, y, z],
                format: 'png',
                mapfile_dir: MAPFILE_DIR
            });
        } catch (err) {
            res.send('Tile invalid: ' + err.message + '\n');
        }

        tile.render(function(err, data) {
            if (!err) {
                res.send.apply(res, data);
            } else {
                res.send('Tile rendering error: ' + err + '\n');
            }
        });
    });

    sys.print('geode (' + opt.port + ')');
    app.listen(opt.port);
};

module.exports = {
    start: function(opt) {
        return geode(opt);
    }
};
