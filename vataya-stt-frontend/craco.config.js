const CracoLessPlugin = require("craco-less");
// import CracoLessPlugin from "craco-less";

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: {
    port: 9000,
  },
};
