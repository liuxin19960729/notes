const { EventEmitter } = require("events")

const emitter = new EventEmitter();

emitter.on("ss", (a) => console.log(a))

emitter.emit("ss", 111)
