import DatePicker from "react-datepicker"

import { Input, ExtendedInputProps } from "../Input"
import { DATE_DISPLAY_FORMAT } from "constants/date"

import "react-datepicker/dist/react-datepicker.css"

export interface DateInputProps extends Omit<ExtendedInputProps, "onChange"> {
  onChange: (date:Date | [Date | null, Date | null] | null) => void
}

export const DateInput = ({
  value,
  label,
  error,
  id,
  // To-do: add additional styling for disabled state (make it more visible that it is disabled)
  disabled,
  className,
  type = "text",
  onChange,
  ...rest
}: DateInputProps) => {

  return (
    <DatePicker
      dateFormat={DATE_DISPLAY_FORMAT}
      className={className}
      selected={(value && new Date(value as string)) || null }
      onChange={(date) => onChange(date)}
      customInput={<Input label={label} />}
    />
  );
}
