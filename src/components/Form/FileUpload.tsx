import React from "react";
import { useField } from "formik";
import { FileUpload as BaseFileUpload, FileUploadProps } from "@commitUI";

type Props = Omit<FileUploadProps, "setFile"> & {
  name: string;
};

export const FileUpload = ({ name, ...props }: Props) => {
  const [field, meta, helper] = useField(name);
  const { touched, error } = meta;
  const { setValue } = helper;
  const setFile = (base64?: string) => setValue(base64);

  return (
    <BaseFileUpload
      {...props}
      text={props.type === "image" ? field.value : props.type?.toUpperCase()}
      setFile={setFile}
      error={touched && error ? error : ""}
    />
  );
};
