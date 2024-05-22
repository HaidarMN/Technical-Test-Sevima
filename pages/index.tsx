import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useLayoutStore } from "@/stores/layout";

import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { firestoreDB } from "@/src/plugins/firebase";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CardTotal from "@/components/overview/CardTotal";
import CardTask from "@/components/overview/CardTasks";
import { FirestoreParams } from "@/src/types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Home = () => {
  const { setBreadcrumb, errorHandler, setAlert } = useLayoutStore();

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
    },
    xaxis: {
      categories: dataChart?.map((item) => item.month),
    },
  };

  const chartSeries = [
    {
      name: "High",
      data: dataChart?.map((item) => item.high) as number[],
    },
    {
      name: "Normal",
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
      <div className="grid grid-cols-4 gap-6">
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

      <div className="flex w-full flex-row rounded-lg bg-white shadow-md">
        <div className="flex w-[75%] flex-col gap-2 border-r px-8 py-6">
          <span className="text-xl font-bold">Tickets Graph</span>
          <span className="text-sm text-slate-500">
            Last updated in 99 December 2099 10:15:20
          </span>

          <Chart
            type="area"
            options={chartOptions}
            series={chartSeries}
            height={400}
          />
        </div>

        <div className="grid-row-3 grid w-[25%] py-8">
          <div className="flex flex-col items-center justify-center gap-4 border-b p-4">
            <span className="font-semibold text-slate-500">Total High</span>
            <span className="text-3xl font-bold">{totalDataChart?.high}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 border-b p-4">
            <span className="font-semibold text-slate-500">Total Normal</span>
            <span className="text-3xl font-bold">{totalDataChart?.normal}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <span className="font-semibold text-slate-500">Total Low</span>
            <span className="text-3xl font-bold">{totalDataChart?.low}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex w-full flex-col rounded-lg bg-white px-8 py-6 shadow-md">
          <div className="flex w-full flex-row items-start justify-between">
            <span className="text-xl font-bold">Unresolved Tickets</span>
            <Link
              href="/unresolved-tickets"
              className="font-semibold text-blue-500 underline-offset-2 hover:underline"
            >
              View details
            </Link>
          </div>
        </div>
        <CardTask />
      </div>
    </MainLayout>
  );
};

export default Home;
