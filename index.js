require('dotenv').config();

if (!process.env.VERSION)
	process.env.VERSION = require('./package.json').version; // eslint-disable-line global-require

const express = require('express');
const database = require('./database');

const configuration = {
	port:8080,
	middleware:[
		express.json(),
	],
	routes:[
		rootDocument(),
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

function rootDocument() {
	const router = express.Router();

	router.get('/index.json',(request, response) => {

		return response.status(200).json({
			host       : request.hostname,
			deployment : process.env.DEPLOYMENT,
			env        : process.env.NODE_ENV,
			version    : process.env.VERSION,
		})
	})

	router.get('/', (request,response) => {
		return response.status(200)
		.set({
			'Cache-Control' : 'max-age=0',
			'Expires'       : new Date().toUTCString(),
			'Content-Type'  : 'text/html',
		})
		.send(function render(data) {
			return [
				`
				<!DOCTYPE html>
				<html lang="en" dir="ltr">
					<head>
						<meta charset="utf-8">
						<title>${data.title}</title>
						<style type="text/css" media="screen">
							html, body { background-color: #111; color: #acf; }
							body { margin: 0.5rem; }
						</style>
					</head>
					<body>
						<h2>${data.host} Debugging</h2>
						<h3>Env Variables</h3>
						<table>
							<tbody>
								`,
								Object.entries(data).map(([key,value]) => `<tr><td>${key}</td><td>${JSON.stringify(value)}</td></tr>`).join(''),
								`
							</tbody>
						</table>
					</body>
				</html>
				`,
			].join('').replace(/[\t\n]+/g,'');
		}({
			title      : 'Hello Index',
			host       : request.hostname,
			ip         : request.ip,
			deployment : process.env.DEPLOYMENT,
			env        : process.env.NODE_ENV,
			version    : process.env.VERSION,
		}))
	});

	return router;
}

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
