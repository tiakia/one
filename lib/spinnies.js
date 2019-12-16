const Spinnies = require("spinnies");
const cliSpinners = require("cli-spinners");
const pkg = require("./../package.json");

const frames = pkg.config.spinnerFrames;
const spinnerFrames = cliSpinners[`${frames}`].frames;

const spinnies = new Spinnies({
  spinner: { frames: spinnerFrames }
});

module.exports = spinnies;
