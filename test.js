var config = require("./pr-title-checker-config.json")
//console.log(config);

let { CHECKS, LABEL, MESSAGES } = JSON.parse(JSON.stringify(config));

console.log((LABEL))