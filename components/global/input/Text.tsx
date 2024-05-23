import { GlobalInputType } from "@/src/types";
import { FC } from "react";
import { useController } from "react-hook-form";

const InputText: FC<GlobalInputType> = ({
  name,
  label,
  placeholder,
  icon,
  error,
  primary = false,
  disabled = false,
  control,
  passValue,
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
      <label
        htmlFor={name}
        className="flex flex-row items-start gap-1 text-sm text-slate-950 dark:text-white"
      >
        {primary && <strong className="text-red-600">*</strong>}
        {label}
      </label>
      <div className="flex w-full flex-row items-center">
        {icon && (
          <div
            className={`flex h-10 items-center justify-center rounded-l border px-3 py-2 ${
              error
                ? "border-red-600 bg-red-600 text-white"
                : "border-slate-950 bg-gray-100 text-slate-950"
            }`}
          >
            {icon}
          </div>
        )}
        <input
          {...fieldProps}
          type="text"
          id={name}
          placeholder={placeholder}
          className={`h-10 w-full border p-2 ${icon ? "rounded-r-md border-l-0" : "rounded-md"} ${disabled ? "cursor-not-allowed bg-gray-300" : null} ${error ? "border-red-600 focus:border-red-600" : "border-slate-300 focus:border-slate-400 focus:shadow-sm"}`}
          disabled={disabled}
          onChange={(e) => {
            if (typeof passValue === "function") {
              passValue(e?.target?.value);
            }
            if (control) {
              fieldProps?.onChange(e?.target?.value);
            }
          }}
        />
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};

export default InputText;
