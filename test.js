var config = require("./pr-title-checker-config.json")
//console.log(config);

try {
    config //= await getJSON(configPath);
    console.log("test")
} catch (e) {
    core.setFailed(`Couldn't retrieve the config file specified - ${e}`);
    return;
}