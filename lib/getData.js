const superagent = require("superagent");
const cheerio = require("cheerio");
const chalk = require("chalk");
const ejs = require("ejs"); //ejs模版引擎
const fs = require("fs");
const path = require("path");
const spinnies = require("./spinnies");

// one 的网址
const oneUrl = "http://wufazhuce.com/";

async function getOneData() {
  try {
    spinnies.add("spinner-1", {
      text: "start fetching",
      color: "yellowBright",
      indent: 2
    });
    let oneData = [];
    let res = await superagent.get(oneUrl);
    spinnies.succeed("spinner-1", { text: "fetch success" });

    let $ = cheerio.load(res.text);
    let selectItem = $("#carousel-one .carousel-inner .item");
    selectItem.each((idx, element) => {
      oneData.push({
        img: $(element)
          .find(".fp-one-imagen")
          .attr("src"),
        type: $(element)
          .find(".fp-one-imagen-footer")
          .text()
          .trim(),
        date:
          $(element)
            .find(".fp-one-titulo-pubdate .may")
            .text()
            .trim() +
          "-" +
          $(element)
            .find(".fp-one-titulo-pubdate .dom")
            .text()
            .trim(),
        text: $(element)
          .find(".fp-one-cita")
          .text()
          .trim()
      });
    });
    /* const fileContent = `oneData=${JSON.stringify(oneData)}`;
     * fs.writeFileSync("./lib/oneData.js", fileContent); */
    return oneData;
  } catch (e) {
    console.log(chalk.redBright(e));
  }
}

async function parseData(htmlData) {
  let fileData = await fs.readFileSync(path.resolve(__dirname, "index.ejs"));
  let template = fileData.toString();
  let html = await ejs.render(template, { data: htmlData });
  return html;
}

async function canvasData(htmlData) {
  let fileData = await fs.readFileSync(path.resolve(__dirname, "canvas.ejs"));
  let template = fileData.toString();
  let html = await ejs.render(template, { data: JSON.stringify(htmlData) });
  return html;
}

async function getData() {
  let htmlData = await getOneData();
  let fileData = await parseData(htmlData);
  return fileData;
}

async function getCanvasData() {
  let htmlData = await getOneData();
  let fileData = await canvasData(htmlData);
  return fileData;
}

module.exports = { getData, getCanvasData };
