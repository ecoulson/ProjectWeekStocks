const Express = require('express');
const App = Express();
const BodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const slipsToApprove = [];

const teamBalance = {
	"itea": 10000000,
	"carps": 10000000,
	"asia": 10000000,
	"yurt": 10000000
}

App.use(BodyParser.urlencoded({ extended: false }))
App.use(BodyParser.json());

App.post('/api/slip', (req, res) => {
	slipsToApprove.push(req.body);
	res.send().status(200);
});

App.get('/api/slip', (req, res) => {
	res.json(slipsToApprove).status(200);
});

App.post('/api/approve/:id', (req, res) => {
	slipsToApprove.splice(req.params.id, 1)[0];
	req.body.value = req.body.pps * req.body.shares;
	let teamName = req.body.teamName.toLowerCase();
	teamBalance[teamName] -= req.body.value;
	req.body.balance = teamBalance[teamName];
	fs.appendFile(path.resolve(__dirname, 'slips'), JSON.stringify(req.body) + "\n", (err) => {
		if (err) {
			res.send("Error saving the slip").status(500);
		}
	});
	res.send().status(200);
});

App.get('/api/slip/log', (req, res) => {
	fs.readFile(path.resolve(__dirname, 'slips'), 'utf-8', (err, data) => {
		if (err) {
			return res.send("Error retreiving the slips").status(500);
		}
		let slips = data.split('\n');
		if (slips[slips.length - 1] == '') {
			slips.splice(slips.length - 1, 1);
		}
		slips = slips.reverse();
		for (let i = 0; i < slips.length; i++) {
			slips[i] = JSON.parse(slips[i]);
		}
		return res.json(slips).status(200);
	});
});

App.use(Express.static(path.resolve(__dirname, 'client')));


let port = process.env.PORT ? process.env.PORT : 8080;
App.listen(port, () => {
	info(`Starting server on port ${port}`)
});

function info(data) {
	log("info", data);
}

function log(level, data) {
	process.stdout.write(`[${level}]: ${data}\n`);
}