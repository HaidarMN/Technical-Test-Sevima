import { useEffect, useState } from "react";
import Link from "next/link";
import { useLayoutStore } from "@/stores/layout";
import { useTranslation } from "react-i18next";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestoreDB } from "@/src/plugins/firebase";

const CardUnresolvedTicket = () => {
  const { t } = useTranslation();
  const { errorHandler, setAlert } = useLayoutStore();

  const [totalItem, setTotalItem] = useState<{
    high: number;
    medium: number;
    low: number;
  }>();

  const getData = async () => {
    try {
      const qHigh = query(
        collection(firestoreDB, "tickets"),
        where("priority", "==", "high"),
        where("status", "==", "pending"),
      );
      const qMedium = query(
        collection(firestoreDB, "tickets"),
        where("priority", "==", "medium"),
        where("status", "==", "pending"),
      );
      const qLow = query(
        collection(firestoreDB, "tickets"),
        where("priority", "==", "low"),
        where("status", "==", "pending"),
      );
      const totalHigh = await getDocs(qHigh);
      const totalMedium = await getDocs(qMedium);
      const totalLow = await getDocs(qLow);

      setTotalItem({
        high: totalHigh.docs.length,
        medium: totalMedium.docs.length,
        low: totalLow.docs.length,
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white shadow-md dark:bg-slate-950">
      <div className="flex w-full flex-col items-start justify-between px-8 pt-6 md:flex-row">
        <span className="text-lg font-bold md:text-xl dark:text-sky-500">
          {t("overview:unresolved-tickets")}
        </span>
        <Link
          href="/tickets?status=pending"
          className="font-semibold text-blue-500 underline-offset-2 hover:underline dark:text-white"
        >
          {t("overview:view-details")}
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-1 divide-y dark:divide-slate-400">
        <div className="flex flex-row items-center justify-between px-8 py-4">
          <Link
            href="/tickets?priority=high&status=pending"
            className="font-semibold text-blue-500 underline-offset-2 hover:underline dark:text-white"
            title="Unresolved High"
          >
            High
          </Link>
          <span className="dark:text-slate-400">{totalItem?.high}</span>
        </div>
        <div className="flex flex-row items-center justify-between px-8 py-4">
          <Link
            href="/tickets?priority=medium&status=pending"
            className="font-semibold text-blue-500 decoration-slate-500 underline-offset-2 hover:underline dark:text-white"
            title="Unresolved Medium"
          >
            Medium
          </Link>
          <span className="dark:text-slate-400">{totalItem?.medium}</span>
        </div>
        <div className="flex flex-row items-center justify-between px-8 py-4">
          <Link
            href="/tickets?priority=low&status=pending"
            className="font-semibold text-blue-500 decoration-slate-500 underline-offset-2 hover:underline dark:text-white"
            title="Unresolved Low"
          >
            Low
          </Link>
          <span className="dark:text-slate-400">{totalItem?.low}</span>
        </div>
      </div>
    </div>
  );
};

export default CardUnresolvedTicket;
