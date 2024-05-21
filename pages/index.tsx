import CardTotal from "@/components/overview/CardTotal";
import MainLayout from "@/layouts/MainLayout";
import axiosApi from "@/src/plugins/axios";
import dynamic from "next/dynamic";

// Stores
import { useLayoutStore } from "@/stores/layout";
import { useEffect, useState } from "react";

import { DataChartParams, ListTotalParams } from "@/src/types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Home = () => {
  const { setBreadcrumb, errorHandler } = useLayoutStore();

  const [listTotal, setListTotal] = useState<ListTotalParams>();
  const [loadingListTotal, setLoadingListTotal] = useState<boolean>(false);
  const [dataChart, setDataChart] = useState<DataChartParams[]>();
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
      const response = await axiosApi.get("/list-total.json");
      setListTotal(response.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoadingListTotal(false);
    }
  };

  const getDataChart = async () => {
    try {
      const response = await axiosApi.get("/tickets-graph.json");
      setDataChart(response.data);
      setTotalDataChart({
        high: dataChart
          ?.map((item) => item.high)
          .reduce((prevNum, currNum) => prevNum + currNum) as number,
        normal: dataChart
          ?.map((item) => item.normal)
          .reduce((prevNum, currNum) => prevNum + currNum) as number,
        low: dataChart
          ?.map((item) => item.low)
          .reduce((prevNum, currNum) => prevNum + currNum) as number,
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
      <div className="flex flex-row items-center gap-6">
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

      <div className="flex w-full flex-row rounded-lg bg-white px-8 py-6 shadow-md">
        <div className="flex w-[75%] flex-col gap-2 border-r">
          <span className="text-2xl font-bold">Tickets Graph</span>
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

        <div className="grid-row-3 grid w-[25%]">
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

      <div className="flex w-full flex-row items-start gap-6">
        <div className="flex w-full flex-col rounded-lg bg-white px-8 py-6 shadow-md"></div>
        <div className="flex w-full flex-col rounded-lg bg-white px-8 py-6 shadow-md"></div>
      </div>
    </MainLayout>
  );
};

export default Home;
