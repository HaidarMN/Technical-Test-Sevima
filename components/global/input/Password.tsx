import { GlobalInputType } from "@/src/types";
import { FC, useState } from "react";
import { useController } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";

const InputPassword: FC<GlobalInputType> = ({
  name,
  label,
  placeholder,
  error,
  primary = false,
  disabled = false,
  control,
  icon,
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
  const [currentType, setCurrentType] = useState("password");

  const togglePassword = () => {
    if (currentType === "password") {
      setCurrentType("text");
    } else {
      setCurrentType("password");
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <label
        htmlFor={name}
        className="flex flex-row items-start gap-1 text-sm text-slate-950"
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
        <div className="flex w-full flex-row items-center">
          <input
            {...fieldProps}
            type={currentType}
            id={name}
            placeholder={placeholder}
            className={`peer h-10 w-full rounded-r-none border border-r-0 p-2 pr-0 focus:outline-none ${icon ? "rounded-r-md border-l-0" : "rounded-md"} ${disabled ? "cursor-not-allowed bg-gray-300" : null} ${error ? "border-red-600" : "border-slate-300 focus:border-slate-400 focus:shadow-sm"}`}
            disabled={disabled}
            onChange={(e: any) => {
              if (typeof passValue === "function") {
                passValue(e?.target?.value);
              }
              if (control) {
                fieldProps?.onChange(e?.target?.value);
              }
            }}
          />
          <div
            onClick={togglePassword}
            className={`flex h-10 cursor-pointer items-center rounded-r border border-l-0 bg-[#FFF] px-2 text-gray-500 ${error ? "border-red-600 focus:border-red-600" : "border-slate-300 peer-focus:border-slate-400 peer-focus:shadow-sm"}`}
          >
            {currentType == "password" ? <IoEye /> : <IoEyeOff />}
          </div>
        </div>
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};

export default InputPassword;
