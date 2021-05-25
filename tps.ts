import net from 'net';

let avgDelay = 0;
let Loop = 0;
let Timer = 0;


const options = {
	host: '52.231.183.177',
	path: '/',
	port: 80,
	method: "GET"
};

process.on('SIGINT', () => {
    console.log("\nResult")
    CalculateTPS();
    process.exit();
});


function CalculateTPS() {
    return console.log("TPS:", Math.round(Loop/((Date.now()-Timer)/1000)), '|', Math.round((Date.now() - Timer)/1000), 'Sec', '|', "Avarage ResponseTime:", parseFloat((avgDelay/Loop).toFixed(2)), "ms");
}

(async () => {
	console.log("Testing", options.host, options.port, options.path, options.method);
    Timer = Date.now();

    setInterval(CalculateTPS, 1000);
    TPS();

    function TPS() {
        const serverSocket = net.connect(options.port, options.host+((options.path == '/')? '' : options.path), () => {
            let Time = Date.now();
            serverSocket.on("data", (b) => {
                // console.log(b.toString());
                if (b.toString().split('\n')[0].indexOf('200') == -1) {
                    console.log("Error:", b.toString().split('\n'));
                    process.exit(1);
                }
                avgDelay += Date.now() - Time;
                Loop++;
                SendReq();
            });
            serverSocket.on("end", TPS);
            SendReq();
            function SendReq() {
                Time = Date.now();
                serverSocket.write(`${options.method} ${options.path} HTTP/1.1\r\n` +
                'Accept: */*\r\n' + 
                'Accept-Encoding: gzip, deflate\r\n' +
                'Connection: keep-alive\r\n' +
                `Host: ${options.host}\r\n` +
                'User-Agent: TPS/1.0\r\n' + 
                'Keep-Alive: timeout=5, max=2000\r\n' +
                '\r\n');
            }
        })
    }
    
})();
