const stream = require('../utils/stream');
const db = require('../utils/db');

exports.movie = async (req, res) => {
    const movie = req.body.movie;

    const hash = movie.torrents.filter(element => {
        return element.quality === '720p';
    });

    if (hash.length != 0)
        return res.status(200).json({'status': 200, 'hash': hash[0].hash});
}


exports.stream = async (req, res) => {
    
    const imdb = req.params.imdb;
    const hash = req.params.hash;
    const range = req.headers.range;


    if (!hash || hash === undefined) {
        console.log('hash error', hash);
        return res.status(400).send("Requires hash param");

    }

    if (!imdb || imdb === undefined) {
        console.log('imdb error', imdb);
        return res.status(400).send("Requires hash param");
    }

    if (!range || range === undefined)
        return res.status(400).send("Requires Range header");

    try {
        const r = await db.pool.query('INSERT INTO movies (imdb) VALUES (?) ON DUPLICATE KEY UPDATE last_seen = NOW()', imdb);
        await db.pool.query('INSERT INTO hashes (movie_id, hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = NOW()', [r.insertId, hash]);
        
        let m = await db.select(null, 'hashes', ['hash'], [hash]);
        m = m[0];

        if (m.status == 'F' && m.path != null)
            stream.local(res, range, m);
        else
            stream.torrent(res, range, m);

    } catch (error) {
        res.status(400).end;
        console.log('stream error:', error);
    }
}