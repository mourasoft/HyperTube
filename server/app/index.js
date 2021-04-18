const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const config = require('./config/config');
const routes = require('./routes/routes');

const cors = require('cors');


app.use(cors());

app.use(bodyparser.json({limit: '5mb'}));
app.use('/images', express.static('images')); 

app.use((req, res, next) => {
	console.log('a request made from:', req.hostname);
	next();
});

app.use('/api/v1', routes.router);

app.use((req, res, next) => {
	res.status(404).json({
		"status": 404,
		"success": false,
		"message": "Not Found"
	});
});

config.path = __dirname;
app.listen(config.ports.server, console.log(`server is running on ${config.host}:${config.ports.server}`));
