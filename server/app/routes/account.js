const router = require('express').Router();
const account = require('../controllers/account');


router.get('/me', account.me);
router.post('/update/info', account.info);
router.post('/update/password', account.password);
router.post('/upload', account.upload);



exports.router = router;
