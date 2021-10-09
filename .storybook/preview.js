import React from "react";
import { addDecorator } from "@storybook/react";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";

import "../src/@commitUI/assets/css/index.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

addDecorator((storyFn) => <ChakraProvider>{storyFn()}</ChakraProvider>);
