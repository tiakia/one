const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const http = require("http");
const spinnies = require("./spinnies");

const { getData, getCanvasData } = require("./getData");

const server = http.createServer(async (req, res) => {
  // console.log(req.url);
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
    let fileData = await getData();
    res.end(fileData);
  } else if (req.url === "/style.css") {
    res.writeHead(200, { "Content-Type": "text/css;charset=utf9" });
    let cssData = await fs.readFileSync(path.resolve(__dirname, "./style.css"));
    res.end(cssData);
  } else if (req.url === "/favicon.ico") {
    res.writeHead(200, { "Content-Type": "image/png" });
    let favicon = fs.readFileSync(path.resolve(__dirname, "./favicon.ico.png"));
    res.end(favicon);
  } else if (req.url === "/canvas.html") {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
    let htmlData = await getCanvasData();
    res.end(htmlData);
  } else if (req.url === "/sendBase64") {
    // canvas转换成base64之后发送到后端
    let allData = "";
    req.on("data", chunk => {
      allData += chunk;
    });
    req.on("end", () => {
      // console.log(allData);
      let base64Data = allData.replace(/^data:image\/\w+;base64,/, "");
      let dataBuffer = Buffer.from(base64Data, "base64");
      // console.log(dataBuffer);
      fs.writeFile("one-base64.png", dataBuffer, err => {
        if (err) console.log(chalk.red(err));
        console.log(chalk.green("one-base64.png on saved on " + process.cwd()));
      });
      res.writeHead(200);
      res.end(base64Data);
    });
  }
});

server.listen(9001, err => {
  if (err) {
    console.log(chalk.red(err));
  } else {
    // console.log(chalk.greenBright("server is listen at port: ", 9001));
    (async () => {
      spinnies.add("spinner-2", {
        text: "Waiting",
        color: "yellowBright"
      });

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto("http://localhost:9001");
      await page.screenshot({ path: "d:/full.png", fullPage: true });

      await page.setViewport({
        width: 565,
        height: 517,
        deviceScaleFactor: 1
      });
      await page.goto("http://localhost:9001/canvas.html", {
        waitUntil: "load"
      });
      page.on("console", msg => {
        for (let i = 0; i < msg.args().length; ++i)
          console.log(`${i}: ${msg.args()[i]}`);
      });
      let pngBuffer = await page.screenshot({ path: "d:/one.png" });
      fs.writeFile("one-buffer.png", pngBuffer, err => {
        if (err) console.log(chalk.red(err));
        console.log(chalk.green("one-buffer.png is saved on " + process.cwd()));
      });
      await browser.close();
      server.close();

      spinnies.succeed("spinner-2", { text: "Enjoy" });
      if (fs.existsSync("d:/one.png")) {
        console.log(chalk.yellowBright("Please check on d:/one.png"));
      }
    })();
  }
});
