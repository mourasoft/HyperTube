const router = require('express').Router();
const auth = require('./auth');
const account = require('./account');
const confirm = require('./confirm');
const movies = require('./movie.js');

const onmniauth = require('./omniauth');
var torrentStream = require('torrent-stream');

var path = require('path')
const token = require('../utils/token');


router.use('/auth', auth.router);
router.use('/omniauth', onmniauth.router);
router.use('/confirm', confirm.router);

router.use('/account', token.verify ,account.router);


router.use('/movie', movies.router);


// router.use('/video', (req, res) => {
//     var engine = torrentStream('magnet:?xt=urn:btih:8A799421F6B25F325CF3FB673C1DEEE226398399', {
//         path: './8A799421F6B25F325CF3FB673C1DEEE226398399'        
//     });
    
//     engine.on('ready', function() {
//         engine.files.forEach(function(file) {
//            if (path.extname(file.name).slice(1) === "mp4") {
//                 file.select();
//                 const range = req.headers.range;

//                 const CHUNK_SIZE = 10 ** 12; // 1MB
//                 const start = Number(range.replace(/\D/g, ""));
//                 const end = Math.min(start + CHUNK_SIZE, file.length - 1);
            

//                 console.log('start', start, 'end', end);
//                 const headers = {
//                     "Content-Range": `bytes ${start}-${end}/${file.length}`,
//                     "Accept-Ranges": "bytes",
//                     "Content-Length": CHUNK_SIZE,
//                     "Content-Type": "video/mp4",
//                 };

//                 res.writeHead(206, headers);
//                 var stream = file.createReadStream({start, end});
//                 stream.pipe(res);
//            }
//             // stream is readable stream to containing the file content
//         });
//     });

// });




// var MovieInfo = req.url.split("/");
// var engine = torrentStream("magnet:?xt=urn:btih:" + MovieInfo[1], {
//     path: `./stream/${MovieInfo[1]}`,
// });
// engine.on("ready", function () {
//     engine.files.forEach(function (file) {
//         if (path.extname(file.name).slice(1) === "jpg") {
//         } else {
//             if (path.extname(file.name).slice(1) === "mp4") {
//                 var range = req.headers.range;
//                 file.select();
//                 if (range) {
//                     const parts = range.replace("bytes=", "").split("-");
//                     const start = parseInt(parts[0]);
//                     const end = parts[1]
//                         ? parseInt(parts[1])
//                         : file.length - 1;
//                     const chunkSize = end - start + 1;
//                     const header = {
//                         "Content-Range": `bytes ${start}-${end}/${file.length}`,
//                         "Accept-Ranges": "bytes",
//                         "Accept-Ranges": chunkSize,
//                         "Content-Type": `video/mp4`,
//                         "Content-Length": `${file.length}`,
//                     };
//                     res.writeHead(206, header);
//                     file.createReadStream({ start, end }).pipe(res);
//                 }
//             } else if (path.extname(file.name).slice(1) === "mkv") {
//                 file.select();
//                 var test = new ffmpeg(file.createReadStream())
//                     .format("webm")
//                     .on("error", (err) => {});
//                 test.pipe(res);
//             }
//         }
//     });
//     engine.on("idle", function () {
//         var MvPath = `${MovieInfo[1]}/${engine.files[0].path}`;
//         db.query(
//             "UPDATE MoviesList SET MoviePath = ? WHERE imdbCode = ?;",
//             [MvPath, MovieInfo[2]],
//             (err, res) => {}
//         );
//     });
// });
// });

exports.router = router;