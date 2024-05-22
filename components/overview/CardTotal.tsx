import { FC } from "react";
import { CardTotalType } from "@/src/types";

const CardTotal: FC<CardTotalType> = ({ title, isLoading, total }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-white px-8 py-6 shadow-md">
      <span className="font-semibold text-slate-500">{title}</span>
      {isLoading ? (
        <span className="h-4 w-full animate-pulse rounded-md bg-slate-200" />
      ) : (
        <span className="text-4xl font-bold">{total}</span>
      )}
    </div>
  );
};

export default CardTotal;
