const router = require('express').Router();
const auth = require('./auth');
const account = require('./account');
const confirm = require('./confirm');
const movies = require('./movie.js');
const onmniauth = require('./omniauth');
const token = require('../utils/token');




router.use('/auth', auth.router);
router.use('/omniauth', onmniauth.router);
router.use('/confirm', confirm.router);
router.use('/account', token.verify ,account.router);
router.use('/movie', movies.router);


exports.router = router;