const router = require('express').Router()
const { getAllComments,addComment } = require('../controllers/comment')

router.get('/:movie_id', getAllComments)
router.post('/', addComment)

exports.router = router