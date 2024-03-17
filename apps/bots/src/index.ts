import http from "http";

async function init () {
    const httpServer = http.createServer();
    const PORT = process.env.PORT ?? 9000;

    httpServer.listen(PORT, () => {
        console.log(`Http Server started at port ${PORT}`);
    })
}

init();