import React from "react";
import { Story, Meta } from "@storybook/react";

import { Alert, AlertProps } from ".";

export default {
  title: "Components/Alert",
  component: Alert,
} as Meta;

const Template: Story<AlertProps> = (args) => <Alert {...args} />;

export const Error = Template.bind({});
Error.args = {
  status: "error",
  message: "Invalid credentials. Please try again",
};

export const Success = Template.bind({});
Success.args = {
  status: "success",
  message: "Account created succesfully!",
};

export const Info = Template.bind({});
Info.args = {
  status: "info",
  message: "It is a good practice to sleep 8 hours a day",
};

export const Warning = Template.bind({});
Warning.args = {
  status: "warning",
  message: "Warning, system maintenance",
};

export const CanBeClosed = Template.bind({});
CanBeClosed.args = {
  status: "error",
  message: "You can dismiss this message",
  canClose: true,
};

export const NoIcon = Template.bind({});
NoIcon.args = {
  status: "error",
  message: "No Icon",
  hasIcon: false,
};
