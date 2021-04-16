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
    
    const hash = req.params.hash;
    const range = req.headers.range;

    if (!hash)
        return res.status(400).send("Requires hash param");

    if (!range)
        return res.status(400).send("Requires Range header");
    


    try {
        await db.pool.query('INSERT INTO movies (hash) VALUES (?) ON DUPLICATE KEY UPDATE last_seen = NOW()', hash);
        
        let m = await db.select(null, 'movies', ['hash'], [hash]);
        m = m[0];


        if (m.status == 'F' && m.path != null)
            stream.local(res, range, m.path);
        else
            stream.torrent(res, range, m);

        
    } catch (error) {
        console.log('stream error:', error);
        
    }
}



// const range = req.headers.range;
// if (!range) {
//   res.status(400).send("Requires Range header");
// }

// // get video stats (about 61MB)
// const videoPath = "bigbuck.mp4";
// const videoSize = fs.statSync("bigbuck.mp4").size;

// // Parse Range
// // Example: "bytes=32324-"
// const CHUNK_SIZE = 10 ** 6; // 1MB
// const start = Number(range.replace(/\D/g, ""));
// const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

// // Create headers
// const contentLength = end - start + 1;
// const headers = {
//   "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//   "Accept-Ranges": "bytes",
//   "Content-Length": contentLength,
//   "Content-Type": "video/mp4",
// };

// // HTTP Status 206 for Partial Content
// res.writeHead(206, headers);

// // create video read stream for this particular chunk
// const videoStream = fs.createReadStream(videoPath, { start, end });

// // Stream the video chunk to the client
// videoStream.pipe(res);
