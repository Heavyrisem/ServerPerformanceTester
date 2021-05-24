// const http = require('http');
import http, {IncomingMessage, RequestOptions} from 'http';

let avgDelay = 0;
// let errorCount = 0;
let finishCount = 0;
let Loop = 1000;

const options = {
	hostname: '52.231.155.110',
	path: '/',
	port: '3000',
	method: "GET"
};

(() => {
	console.log("Testing", options.hostname, options.port, options.path, options.method);
	for (let i = 0; i <= Loop; i++) {
		const Timer = Date.now();
		function ResponseHandler(response: IncomingMessage) {
			avgDelay += Date.now() - Timer;
			finishCount++;
			if (i == Loop) {
				return console.log(avgDelay / Loop)
			}
		}
		http.request(options, ResponseHandler).end();
	}
})();