import { RadioInputType } from "@/src/types";
import { FC } from "react";
import { useController } from "react-hook-form";

const InputRadio: FC<RadioInputType> = ({
  name,
  label,
  error,
  primary = false,
  disabled = false,
  control,
  passValue,
  options,
}) => {
  var fieldProps = {} as any;
  if (control) {
    const { field } = useController({
      name,
      control,
    });
    fieldProps = { ...field };
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <span className="flex flex-row items-start gap-1 text-sm text-slate-950">
        {label}
        {primary && <strong className="text-red-600">*</strong>}
      </span>
      <div className="flex w-full flex-col items-start gap-2">
        {options.map((val, index) => (
          <div key={val.value} className="flex flex-row items-center gap-2">
            <input
              {...fieldProps}
              id={`${name}${index}`}
              type="radio"
              value={val.value}
              className={`h-5 w-5 rounded-lg border focus:!ring-2 ${disabled ? "cursor-not-allowed bg-gray-300" : "cursor-pointer"} ${error ? "border-red-600 text-red-600 focus:!ring-red-600" : "border-slate-950 text-slate-950 focus:!ring-slate-950"}`}
              disabled={disabled}
              onChange={(e: any) => {
                if (typeof passValue === "function") {
                  passValue(e?.target?.value);
                }
                if (control) {
                  fieldProps?.onChange(e?.target?.value);
                }
              }}
              checked={fieldProps?.value?.includes(val.value)}
            />
            <label
              htmlFor={`${name}${index}`}
              className={`${disabled ? "cursor-not-allowed bg-gray-300" : "cursor-pointer"} ${error ? "text-red-600" : "text-slate-950"}`}
            >
              {val.label}
            </label>
          </div>
        ))}
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};

export default InputRadio;
