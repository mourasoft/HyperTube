const router = require('express').Router();
const movie = require('../controllers/movie');



router.post('/', movie.movie);
router.use('/stream/:hash', movie.stream);



exports.router = router;