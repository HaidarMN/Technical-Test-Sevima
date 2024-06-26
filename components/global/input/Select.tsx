import { SelectInputType } from "@/src/types";
import { FC } from "react";
import { useController } from "react-hook-form";
import Select from "react-select";

const InputSelect: FC<SelectInputType> = ({
  name,
  label,
  placeholder,
  icon,
  error,
  primary = false,
  disabled = false,
  passValue,
  options,
  control,
  multi = false,
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
                : "border-slate-300 bg-gray-100 text-slate-950"
            }`}
          >
            {icon}
          </div>
        )}
        <Select
          {...fieldProps}
          id={name}
          placeholder={placeholder}
          classNames={{
            container: () => `!w-full !h-10`,
            control: () =>
              `!border !shadow-none ${icon ? "!rounded-r-md !border-l-0" : "!rounded-md"} ${disabled ? "!cursor-not-allowed !bg-gray-300" : null} ${error ? "!border-red-600" : "!border-slate-300"}`,
          }}
          isDisabled={disabled}
          isClearable
          isMulti={multi}
          onChange={(e: any) => {
            const final_value = multi
              ? e?.map((val: any) => val?.value)
              : e?.value;

            if (typeof passValue === "function") {
              passValue(final_value);
            }
            if (control) {
              fieldProps?.onChange(final_value || null);
            }
          }}
          value={options.find((val: any) =>
            multi
              ? fieldProps?.value?.includes(val.value)
              : val.value === fieldProps?.value,
          )}
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};

export default InputSelect;
