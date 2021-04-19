const fs = require('fs'); 
const config = require('../config/config');
const torrentStream = require('torrent-stream');
const mime = require('mime-types');
const db = require('../utils/db');


const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);



exports.torrent = async (res, range, m) => {
    
    console.log('stream torrent', m.hash);
    try {
        const engine = torrentStream(`magnet:?xt=urn:btih:${m.hash}`, {
            trackers: [
                'udp://open.demonii.com:1337/announce',
                'udp://tracker.openbittorrent.com:80',
                'udp://tracker.coppersurfer.tk:6969',
                'udp://glotorrents.pw:6969/announce',
                'udp://tracker.opentrackr.org:1337/announce',
                'udp://torrent.gresille.org:80/announce',
                'udp://p4p.arenabg.com:1337',
                'udp://tracker.leechers-paradise.org:6969'
            ],
            path: `${config.path}/movies/${m.hash}`
        });
    
        engine.on('ready', async () => {

                const files = engine.files;
                const file = files.reduce((a, b) =>  {
                    return (a.length > b.length ? a : b)
                }, files[0]);
    
                engine.current = file;
                const contentType = mime.lookup(file.name);

                if (['video/mp4', 'video/webm', 'video/ogg'].includes(contentType)) {
                    if (m.status == 'N') {
                        console.log(m.hash, 'start downloading...');
                        file.select();
                        await db.update('hashes', 'status', 'D', 'hash', m.hash);
                        await db.update('hashes', 'path', `${config.path}/movies/${m.hash}/${file.path}`, 'hash', m.hash);
                    }

                    const videoSize = file.length;
                    const CHUNK_SIZE = (10 ** 6) * 1; // 1MB
                    const start = Number(range.replace(/\D/g, ""));
                    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

                    const contentLength = end - start + 1;

                    // HTTP Status 206 for Partial Content
                    res.statusCode = 206;
                    res.setHeader('Content-Range', `bytes ${start}-${end}/${videoSize}`);
                    res.setHeader('Accept-Ranges', 'bytes');
                    res.setHeader('Content-Length', contentLength);
                    res.setHeader('Content-Type', contentType);

                    // create video read stream for this particular chunk
                    const stream = file.createReadStream({ start, end });
            
                    stream.pipe(res);

                } else if ('video/x-matroska' == contentType) {

                    if (m.status == 'N') {
                        console.log(m.hash, 'start downloading...');
                        file.select();
                        await db.update('hashes', 'status', 'D', 'hash', m.hash);
                        await db.update('hashes', 'path', `${config.path}/movies/${m.hash}/${file.path}`, 'hash', m.hash);
                    }

                    ///usr/bin/ffmpeg /usr/share/ffmpeg /usr/share/man/man1/ffmpeg.1.gz
                    const stream = file.createReadStream();

                    ffmpeg(stream)
                    .format('webm')
                    .on("start", () => console.log("Conversion started..."))
                    .on("error", error => { console.log('Conversion error', error)})
                    .stream().pipe(res);

                } else
                    res.status(415).end();
                
        });

        
        engine.on('download', (index, piece) => {
                const file = engine.current;
                const total = `${(file.length / (1024 * 1024)).toFixed(2)} mb`.padEnd();
                const chunk = `${(engine.swarm.downloaded/ (1024 * 1024)).toFixed(2)} mb`.padEnd(10);
                const percent = Math.round((100 * engine.swarm.downloaded) / file.length);

                const message = `${engine.infoHash}  ${chunk}  ${total.padEnd(10)}  ${percent} %`
                console.log(message);
        });
    
    
        engine.on('idle', async () => {
            const file = engine.current
            if (engine.swarm.downloaded >= file.length) {
                console.log(engine.infoHash, 'downloaded successfully', engine.swarm.downloaded, '/', file.length);
                await db.update('hashes', 'status', 'F', 'hash', m.hash);
                engine.destroy();
            }
        });
    
    } catch (error) {
        throw error;
    }
}



exports.local = (res, range, m) => {

    console.log('stream local', m.hash);
    try {

        const contentType = mime.lookup(m.path);
        
        // get video stats (about 61MB)
        const videoSize = fs.statSync(m.path).size;
    
        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = (10 ** 6) * 0.5; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    
        // Create headers
        const contentLength = end - start + 1;
        const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": contentType,
        };
    
        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);
    
        // create video read stream for this particular chunk
        const stream = fs.createReadStream(m.path, { start, end });
        stream.pipe(res);
    
    } catch (error) {
        throw error;
    }
}



const convert = (file, thread = 4) => {
	const converted = new ffmpeg(file.createReadStream())
		.videoCodec('libvpx')
		.audioCodec('libvorbis')
		.format('webm')
		.audioBitrate(128)
		.videoBitrate(8000)
		.outputOptions([
			`-threads ${thread}`,
			'-deadline realtime',
			'-error-resilient 1'
		])
		.on('error', err => converted.destroy())
		.stream()
	return converted
}
