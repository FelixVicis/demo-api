const express = require('express');

const configuration = {
	port:8080,
	middleware:[],
	routes:[
	],
};

serve(configuration);


function serve(configuration, done = () => null) {
	const app = express();

	app.set('port', configuration.port);


	app.use([
		...configuration.middleware,
	]);

	app.listen(app.get('port'), () => {
		console.log(`Client started:  http://localhost:${app.get('port')}`); // eslint-disable-line no-console

		done();
	});

	return app;
};

