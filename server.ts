// const express = require('express');
import express from 'express';

const server = express();
const port = process.argv[process.argv.length-1];
server.get("/", (req, res) => {
    // console.log('req');
    return res.send("Hello World"+port);
});

server.listen(port, () => {
    console.log("Server on", port, process.pid);
})