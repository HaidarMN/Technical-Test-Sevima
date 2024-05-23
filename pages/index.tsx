import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import dynamic from "next/dynamic";
import { useLayoutStore } from "@/stores/layout";

import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { firestoreDB } from "@/src/plugins/firebase";

import CardTotal from "@/components/overview/CardTotal";
import CardTask from "@/components/overview/CardTasks";
import { FirestoreParams } from "@/src/types";
import CardUnresolvedTicket from "@/components/overview/CardUnresolvedTickets";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Home = () => {
  const { setBreadcrumb, errorHandler, theme } = useLayoutStore();

  const [listTotal, setListTotal] = useState<DocumentData>();
  const [loadingListTotal, setLoadingListTotal] = useState<boolean>(false);
  const [dataChart, setDataChart] = useState<FirestoreParams[]>([]);
  const [totalDataChart, setTotalDataChart] = useState<{
    high: number;
    normal: number;
    low: number;
  }>();

  const chartOptions = {
    chart: {
      id: "Tickets Graph",
      toolbar: {
        show: false,
      },
      stroke: {
        curve: "smooth",
      },
    },
    xaxis: {
      categories: dataChart?.map((item) => item.month),
    },
    theme: {
      mode: theme,
    },
  };

  const chartSeries = [
    {
      name: "High",
      data: dataChart?.map((item) => item.high) as number[],
    },
    {
      name: "Medium",
      data: dataChart?.map((item) => item.normal) as number[],
    },
    {
      name: "Low",
      data: dataChart?.map((item) => item.low) as number[],
    },
  ];

  const getListTotal = async () => {
    try {
      setLoadingListTotal(true);
      const response = await getDoc(doc(firestoreDB, "list total", "TL"));
      setListTotal(response.data());
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoadingListTotal(false);
    }
  };

  const getDataChart = async () => {
    try {
      const response = await getDocs(collection(firestoreDB, "tickets graph"));
      setDataChart(
        response.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
      setTotalDataChart({
        high: response.docs
          .map((doc) => doc.data().high)
          .reduce((prevNum, currNum) => prevNum + currNum),
        normal: response.docs
          .map((doc) => doc.data().normal)
          .reduce((prevNum, currNum) => prevNum + currNum),
        low: response.docs
          .map((doc) => doc.data().low)
          .reduce((prevNum, currNum) => prevNum + currNum),
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    setBreadcrumb(["Overview"]);
    getListTotal();
    getDataChart();
  }, []);

  return (
    <MainLayout title="Overview">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CardTotal
          title="Unresolved"
          total={listTotal?.unresolved}
          isLoading={loadingListTotal}
        />
        <CardTotal
          title="Overview"
          total={listTotal?.overview}
          isLoading={loadingListTotal}
        />
        <CardTotal
          title="Open"
          total={listTotal?.open}
          isLoading={loadingListTotal}
        />
        <CardTotal
          title="On Hold"
          total={listTotal?.on_hold}
          isLoading={loadingListTotal}
        />
      </div>

      <div className="flex w-full flex-col rounded-lg bg-white shadow-md lg:flex-row dark:bg-slate-950">
        <div className="flex w-full flex-col gap-2 border-b px-8 py-6 lg:w-[75%] lg:border-r">
          <span className="text-lg font-bold md:text-xl dark:text-sky-500">
            Tickets Graph
          </span>
          <span className="text-xs text-slate-500 md:text-sm dark:text-slate-400">
            Last updated in 99 December 2099 10:15:20
          </span>

          <Chart
            type="area"
            options={chartOptions}
            series={chartSeries}
            height={400}
          />

          <span className="text-center text-slate-500 md:hidden dark:text-slate-400">
            Please see the graph in tablet or dekstop for better experience
          </span>
        </div>

        <div className="grid w-full grid-rows-1 lg:w-[25%] lg:grid-rows-3">
          <div className="flex flex-col items-center justify-center gap-4 border-b p-4">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Total High
            </span>
            <span className="text-3xl font-bold dark:text-sky-500">
              {totalDataChart?.high}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 border-b p-4">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Total Medium
            </span>
            <span className="text-3xl font-bold dark:text-sky-500">
              {totalDataChart?.normal}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Total Low
            </span>
            <span className="text-3xl font-bold dark:text-sky-500">
              {totalDataChart?.low}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardUnresolvedTicket />
        <CardTask />
      </div>
    </MainLayout>
  );
};

export default Home;
