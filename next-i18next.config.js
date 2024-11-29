const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "es"], // Add more as needed
  },
  localePath: path.resolve("./public/locales"),
};
