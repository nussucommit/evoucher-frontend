import React from "react";
import { Story, Meta } from "@storybook/react";

import { Text, Props } from ".";

export default {
  title: "Components/Text",
  component: Text,
} as Meta;

const Template: Story<Props> = (args) => <Text {...args} />;

export const Base = Template.bind({});
Base.args = {
  children: "Base",
};

export const SemiBold = Template.bind({});
SemiBold.args = {
  children: "Semi Bold",
  semibold: true,
};

export const Bold = Template.bind({});
Bold.args = {
  children: "Bold",
  bold: true,
};

export const Ellipsize = Template.bind({});
Ellipsize.args = {
  children:
    "Ellipsize is the three dots at the end. This is a super long text. This is a super long text. This is a super long text. This is a super long text. This is a super long text. This is a super long text. ",
  ellipsize: true,
};

export const Small = Template.bind({});
Small.args = {
  children: "size=sm. You can try other sizes as well.",
  size: "sm",
};

export const Warning = Template.bind({});
Warning.args = {
  children: "type=warning. You can try other types(colors) as well.",
  type: "warning",
};
