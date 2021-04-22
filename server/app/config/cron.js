const cron = require('node-cron')
const fs = require('fs')
const db = require('../utils/db');
const path = require('path')

const deleteMovies = async function () {
	db.pool.query('DELETE movies FROM movies WHERE DATEDIFF(NOW(),movies.last_seen)>=30')
}
const getUnwatchedMovie = async function () {
	const movies = await db.pool.query('SELECT path from movies WHERE DATEDIFF(NOW(),movies.last_seen)>=30')
	return movies
}
const deleteMoviesNotWatched = async function () {
	const movies = await getUnwatchedMovie()
	for (movie of movies) {
		deleteMovies()
		const moviePath = path.join(__dirname, process.env.MOVIES_DIR, movie.path)
		console.log(moviePath)
		if (fs.existsSync(moviePath)) fs.unlink(moviePath, (err) => {
			if (err) throw err;
		  })
	}
}
module.exports = function () {
	cron.schedule('0 0 * * *', () => {
		deleteMoviesNotWatched()
	})
}