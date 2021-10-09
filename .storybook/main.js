const path = require("path");

module.exports = {
  stories: ["../src/@commitUI/components/**/*.stories.@(js|jsx|ts|tsx)"],
  refs: {
    "design-system": {
      title: "commIT Design",
      //👇 The url provided by Chromatic when it was deployed
      url: "https://master--60ef059be068fa0039661047.chromatic.com",
    },
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
  ],
  // Need this in order for Chakra UI's styling to work on storybook
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "@emotion/core": "@emotion/react",
          "emotion-theming": "@emotion/react",
        },
      },
    };
  },
};
