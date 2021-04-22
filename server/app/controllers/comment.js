const { getComments, insertComment } = require('../models/commentmodel')

const getAllComments = async function (req, res, next) {
	try {
		const { movie_id } = req.params
		if (typeof movie_id !== 'string' || movie_id.length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: { Eng: 'Incorrect movie_id', Fr: 'Incorrect movie_id' },
			})
		const allComments = await getComments(movie_id, req.user_id)
		if (allComments.length > 0)
			return res.send({
				type: 'success',
				status: 200,
				body: allComments,
			})
		return res.send({
			type: 'error',
			status: 403,
			body: { Eng: 'Comments not found', Fr: 'Commentaires non trouvés' },
		})
	} catch (err) {
		next(err)
	}
}
const addComment = async function (req, res, next) {
	try {
		const { movie_id, comments } = req.body
		if (
			typeof movie_id !== 'string' ||
			!movie_id.trim() ||
			movie_id.trim().length > 10 ||
			typeof comments !== 'string' ||
			!comments.trim() ||
			comments.trim().length > 100
		)
			return res.send({
				type: 'error',
				status: 400,
				body: { Eng: 'Incorrect information', Fr: 'Information incorrecte' },
			})
		const resultInsert = await insertComment({
			user_id: req.user_id,
			movie_id: movie_id.trim(),
			comments: comments.trim(),
		})
		if (resultInsert.insertId)
			return res.send({
				type: 'success',
				status: 200,
				body: resultInsert.insertId,
			})
		return res.send({
			type: 'error',
			status: 403,
			body: { Eng: 'Insert failed', Fr: "L'insertion a échoué" },
		})
	} catch (err) {
		next(err)
	}
}

module.exports = {
	getAllComments,
	addComment,
}