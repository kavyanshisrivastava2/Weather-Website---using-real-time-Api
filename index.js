const http = require("http");
const fs = require("fs");
var requests = require("requests"); 
// const stream = require("stream");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempval, orgVal) => {
  let temperature = tempval.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Kanpur&appid=f44f0afaecb27d63ecb40e2352d3ef71"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arraydata = [objdata];
        // console.log(arraydata[0].main.temp);
        // const realTimeData = arraydata;
        const realTimeData = arraydata.map((val) => replaceVal(homeFile, val)).join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })

      .on("end", (err) => {
        
        if (err) return console.log("connection closed due to errors", err);

        // console.log("end");
        res.end();
      })
  }
});

server.listen(8000, "127.0.0.1");
