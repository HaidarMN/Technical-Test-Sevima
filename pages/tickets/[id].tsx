import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import { useLayoutStore } from "@/stores/layout";
import moment from "moment";

import {
  DocumentData,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestoreDB } from "@/src/plugins/firebase";
import Button from "@/components/global/button";

const DetailTicket = () => {
  const router = useRouter();
  const { setBreadcrumb, errorHandler, setAlert } = useLayoutStore();

  const [data, setData] = useState<DocumentData>([]);
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [isReject, setIsReject] = useState<boolean>(false);

  const getData = async () => {
    try {
      // setLoadingListTotal(true);
      const response = await getDoc(
        doc(firestoreDB, "tickets", router.query.id as string),
      );
      response.exists() &&
        setData({
          ...response.data(),
          created_at: moment(
            response.data().created_at.seconds * 1000 +
              response.data().created_at.nanoseconds / 1000000,
          ).format("D MMMM YYYY, HH:mm:ss"),
        });
    } catch (error) {
      errorHandler(error);
    }
  };

  const onApprove = async () => {
    try {
      setIsApprove(true);
      await updateDoc(doc(firestoreDB, "tickets", router.query.id as string), {
        status: "approved",
        updated_at: serverTimestamp(),
      });
      await getData();
      setAlert({
        type: "success",
        title: "Tickets Approved",
        message: "Succesfully approved tickets",
        show: true,
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsApprove(false);
    }
  };

  const onReject = async () => {
    try {
      setIsReject(true);
      await updateDoc(doc(firestoreDB, "tickets", router.query.id as string), {
        status: "rejected",
        updated_at: serverTimestamp(),
      });
      await getData();
      setAlert({
        type: "success",
        title: "Tickets Rejected",
        message: "Succesfully rejected tickets",
        show: true,
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsReject(false);
    }
  };

  const getPriorityStyle = (value: string) => {
    switch (value) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusStyle = (value: string) => {
    switch (value) {
      case "rejected":
        return "bg-red-500";
      case "approved":
        return "bg-green-500";
      default:
        return "bg-slate-300";
    }
  };

  useEffect(() => {
    setBreadcrumb(["Tickets", "Detail Tickets"]);
    getData();
  }, []);

  return (
    <MainLayout title="Detail Tickets">
      <div className="flex w-full flex-col gap-4 rounded-lg bg-white px-8 py-6 shadow-md">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="text-xl font-bold">{data.title}</h2>
          <Button onClick={() => router.back()}>Back</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">Customer Name</h3>
            <span>{data.customer_name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">Created At</h3>
            <span>{data.created_at}</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">Priority</h3>
            <span
              className={`w-fit rounded-md px-3 py-1 text-sm font-semibold uppercase text-white ${getPriorityStyle(data.priority)}`}
            >
              {data.priority}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">Status</h3>
            <span
              className={`w-fit rounded-md px-3 py-1 text-sm font-semibold uppercase text-white ${getStatusStyle(data.status)}`}
            >
              {data.status}
            </span>
          </div>
        </div>

        {data.status === "pending" && (
          <div className="mt-4 flex flex-row items-center gap-4">
            <button
              className="flex flex-row items-center gap-2 rounded-md border border-green-500 bg-green-500 px-4 py-2 font-medium text-white"
              onClick={onApprove}
            >
              {isApprove && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-slate-300"></div>
              )}
              Approve
            </button>
            <button
              className="flex flex-row items-center gap-2 rounded-md border border-red-500 px-4 py-2 font-medium text-red-500"
              onClick={onReject}
            >
              {isReject && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-200 border-t-red-500"></div>
              )}
              Reject
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DetailTicket;
