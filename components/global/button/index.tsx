import { ButtonType } from "@/src/types";
import { FC } from "react";

const Button: FC<ButtonType> = ({
  type = "button",
  primary = false,
  children,
  onClick,
  isLoading = false,
}) => {
  return (
    <button
      type={type}
      className={`flex flex-row items-center gap-2 rounded-md border border-slate-950 px-4 py-2 font-medium transition-all ease-in-out disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-700 dark:border-sky-500 ${primary ? "bg-slate-950 text-white dark:bg-sky-500" : "text-slate-950 dark:text-sky-500"}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading && (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-slate-300"></div>
      )}
      {children}
    </button>
  );
};

export default Button;
