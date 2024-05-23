import { FC } from "react";
import { CardTotalType } from "@/src/types";

const CardTotal: FC<CardTotalType> = ({ title, isLoading, total }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-white px-8 py-6 shadow-md dark:bg-slate-950">
      <span className="font-semibold text-slate-500 dark:text-slate-400">
        {title}
      </span>
      {isLoading ? (
        <span className="h-4 w-full animate-pulse rounded-md bg-slate-200" />
      ) : (
        <span className="text-4xl font-bold dark:text-sky-500">{total}</span>
      )}
    </div>
  );
};

export default CardTotal;
