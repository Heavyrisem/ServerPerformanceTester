import net from 'net';

let avgDelay = 0;
let max = 0;
let min = -1;
let finishCount = 0;
let Connections = 100;

const options = {
	host: '52.231.183.177',
	path: '/',
	port: 80,
	method: "GET",
	Loop: 100
};

function Requester(callback: Function): void {
	const serverSocket = net.connect(options.port, options.host+((options.path == '/')? '' : options.path), () => {
		let c = 0;
		let Timer = Date.now();

		serverSocket.on("error", (err) => {
			console.log(err);
		})

		serverSocket.on("data", (b) => {
			if (b.toString().split('\n')[0].indexOf('200') == -1) {
				console.log("Error:", b.toString().split('\n'));
				process.exit(1);
			}
			let time = Date.now() - Timer;
			if (max < time) max = time;
			if (min > time || min == -1) min = time;
			avgDelay += time;
			c++;
			finishCount++;
			if (c == options.Loop) {return serverSocket.end()};
			SendReq();
		});
		serverSocket.on('end', () => {callback()})
		
		SendReq();

		function SendReq() {
			serverSocket.write(`${options.method} ${options.path} HTTP/1.1\r\n` +
			'Accept: */*\r\n' + 
			'Accept-Encoding: gzip, deflate\r\n' +
			'Connection: keep-alive\r\n' +
			`Host: ${options.host}\r\n` +
			'User-Agent: TPS/1.0\r\n'+'\r\n');
		}
	});
};

console.log("Creating Connection", options.host, options.port, options.path, options.method);
console.log(Connections, "Connections,", options.Loop, "Requests");
for (let i = 0; i < Connections; i++) {
	Requester(() => {
		if (finishCount == options.Loop*Connections) {
			console.log("Avrage ResponseDelay:", parseFloat((avgDelay/finishCount).toFixed(2)), 'ms |', 'min:', min, 'ms |', 'max:', max, 'ms');
		}
	})
}