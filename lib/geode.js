var express = require('express'),
    Tile = require('tilelive').Tile,
    path = require('path'),
    sys = require('sys'),
    fs = require('fs');

var geode = function(opt) {
    var app = express.createServer();
    var templates_dir = path.normalize(__dirname + '/../static/');
    var mapfile_dir = path.join(__dirname, 'tmp');

    try {
        fs.statSync(mapfile_dir);
    } catch (e) {
        sys.debug('Creating mapfile dir: ' + mapfile_dir);
        fs.mkdirSync(mapfile_dir, 0777);
    }

    app.use(express.static(templates_dir + '/public'));

    app.get('/', function(req, res) {
        var t = t || fs.readFileSync(
            templates_dir + '/index.html',
            'utf-8');
        res.send(t);
    });

    var layers = (function (f) {
        var ext = path.extname(f);
        switch (ext) {
            case '.mml':
                return function() {
                    return {
                        language: 'carto',
                        file: opt.file
                    };
                };
                break;
            case '.xml':
                return function() {
                    return {
                        language: 'xml',
                        file: opt.file
                    };
                }
                break;
        }
    })(opt.file);

    app.get('/1.0.0/:layername/:z/:x/:y.*', function(req, res) {
        try {
            var tile = new Tile({
                scheme: 'tms',
                datasource: layers(req.params.layername).file,
                language: layers(req.params.layername).language,
                xyz: [req.params.x, req.params.y, req.params.z],
                format: 'png',
                mapfile_dir: mapfile_dir
            });
        } catch (err) {
            return res.send('Tile invalid: ' + err.message + '\n');
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
