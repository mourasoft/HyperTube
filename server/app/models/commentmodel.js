const db = require('../utils/db');

const getComments = async function (movie_id, user_id) {
	const comments = await db.pool.query(
		`SELECT IF(u.user_id = ?,1,0) AS 'comments',u.user_id,id,created_at,u.username,u.image FROM comments c,users u WHERE u.user_id=c.user_id AND movie_id=? ORDER BY date DESC`,
		[user_id, movie_id]
	)
	return comments
}

const insertComment = async function (values) {
	const resultInsert = await db.pool.query('INSERT INTO Comments SET ?', [values])
	return resultInsert.affectedRows ? resultInsert : false
}

module.exports = {
	getComments,
    insertComment,
}