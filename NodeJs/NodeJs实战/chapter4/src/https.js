const https = require("https");
const fs = require("fs");

// ssl 秘钥和证书
const options = {
    key: fs.readFileSync("私钥地址"),
    cert: fs.readFileSync("证书地址")
}



const server = https.createServer(options, function (req, res) {

})

server.listen("8080")