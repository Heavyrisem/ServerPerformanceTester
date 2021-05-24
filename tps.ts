import http, {IncomingMessage, RequestOptions} from 'http';

let avgDelay = 0;
// let errorCount = 0;
let Loop = 0;
let MakeReq = true;
let Timer = 0;

const options = {
	hostname: '52.231.155.110',
	path: '/',
	port: '3000',
	method: "GET"
};

process.on('SIGINT', () => {
    MakeReq = false;
    console.log("\nResult")
    CalculateTPS();
    process.exit();
});

function Req(options: RequestOptions): Promise<void> {
    return new Promise(resolve => {
        const Time = Date.now();
        http.request(options, () => {
            avgDelay += Date.now() - Time;
            return resolve();
        }).end();
    })
}

function CalculateTPS() {
    return console.log("TPS:", Math.round(Loop/((Date.now()-Timer)/1000)), '|', Math.round((Date.now() - Timer)/1000), 'Sec', '|', "Avarage ResponseTime:", parseFloat((avgDelay/Loop).toFixed(2)), "ms");
}

(async () => {
	console.log("Testing", options.hostname, options.port, options.path, options.method);
    Timer = Date.now();

    setInterval(CalculateTPS, 1000);

	while (MakeReq) {
        await Req(options);
        Loop++;
	}
})();
