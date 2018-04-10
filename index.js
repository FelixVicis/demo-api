const express = require('express');
const database = require('./database');

const configuration = {
	port:8080,
	middleware:[
		express.json(),
	],
	routes:[
		userResources(),
	],
};

serve(configuration);


function serve(configuration, done = () => null) {
	const app = express();

	app.set('port', configuration.port);


	app.use([
		...configuration.middleware,
		...configuration.routes,
	]);

	app.listen(app.get('port'), () => {
		console.log(`Client started:  http://localhost:${app.get('port')}`); // eslint-disable-line no-console

		done();
	});

	return app;
};

function userResources() {
	const router = express.Router();

	router.get('/user', (request, response) => {
		const users = database.list('user');

		response.status(200).json(users);
	});

	router.get('/user/:user_id', (request, response) => {
		try {
			const user = database.read('user', request.params.user_id);

			response.status(200).json(user);
		} catch (e) {
			response.status(404).json({
				error:true,
				message:e.message,
			});
		}
	});

	router.post('/user', (request, response) => {
		const user = request.body;

		try {
			const created = database.create('user', user);

			response.status(201).json(created);
		} catch (e) {
			response.status(400).json({
				error:true,
				message:e.message,
			});
		}
	});

	router.delete('/user/:user_id', (request, response) => {
		database.delete('user', request.params.user_id);

		response.status(204).json(null);
	});

	return router;
}
