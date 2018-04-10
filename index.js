const express = require('express');

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
		response.status(200).json({hello:'world'});
	});

	return router;
}
