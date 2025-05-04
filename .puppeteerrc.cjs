const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Forzamos a Puppeteer a usar esta carpeta dentro del proyecto
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
