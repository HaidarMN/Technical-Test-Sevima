import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import { useLayoutStore } from "@/stores/layout";
import moment from "moment";

import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestoreDB } from "@/src/plugins/firebase";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FaFilter, FaSortAmountUp } from "react-icons/fa";
import InputSelect from "@/components/global/input/Select";
import { FirestoreParams } from "@/src/types";
import AddTickets from "@/components/tickets/AddTicket";
import Link from "next/link";

const validationSchema = yup.object({
  priority: yup.string().nullable(),
  status: yup.string().nullable(),
  created_at: yup.string().nullable(),
  title: yup.string().nullable(),
});

const Tickets = () => {
  const { control, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();
  const { setBreadcrumb, errorHandler, setAlert } = useLayoutStore();

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [data, setData] = useState<FirestoreParams[]>([]);

  const priorityFilterOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const statusFilterOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const sortOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  const getData = async () => {
    try {
      const { priority, status, title, created_at } = router.query;
      var constraints = [];

      if (priority) {
        constraints.push(where("priority", "==", priority));
        setValue("priority", priority as string);
      }

      if (status) {
        constraints.push(where("status", "==", status));
        setValue("status", status as string);
      }

      if (title) {
        constraints.push(orderBy("title", title === "asc" ? "asc" : "desc"));
        setValue("title", title as string);
      }

      setValue("created_at", created_at === "asc" ? "asc" : "desc");

      const q = query(
        collection(firestoreDB, "tickets"),
        orderBy("created_at", created_at === "asc" ? "asc" : "desc"),
        ...constraints,
      );
      const response = await getDocs(q);

      setData(
        response.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: moment(
            doc.data().created_at.seconds * 1000 +
              doc.data().created_at.nanoseconds / 1000000,
          ).format("D MMMM YYYY, HH:mm:ss"),
        })),
      );
    } catch (error) {
      errorHandler(error);
      console.error(error);
    }
  };

  const onFilterPriority = (val: string) => {
    const query = { ...router.query };
    if (val) {
      query.priority = val;
    } else {
      delete query.priority;
    }
    router.replace({ pathname: router.pathname, query });
  };

  const onFilterStatus = (val: string) => {
    const query = { ...router.query };
    if (val) {
      query.status = val;
    } else {
      delete query.status;
    }
    router.replace({ pathname: router.pathname, query });
  };

  const onSortCreatedAt = (val: string) => {
    const query = { ...router.query };
    if (val) {
      query.created_at = val;
    } else {
      delete query.created_at;
    }
    router.replace({ pathname: router.pathname, query });
  };

  const onSortTitle = (val: string) => {
    const query = { ...router.query };
    if (val) {
      query.title = val;
    } else {
      delete query.title;
    }
    router.replace({ pathname: router.pathname, query });
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
        return "bg-slate-400";
    }
  };

  useEffect(() => {
    setBreadcrumb(["Tickets"]);
    getData();
  }, [router.query]);

  return (
    <MainLayout title="List Tickets">
      <div className="flex w-full flex-col gap-4 rounded-lg bg-white px-8 py-6 shadow-md dark:bg-slate-950">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold dark:text-sky-500">All Tickets</h1>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Total {data.length}
            </span>
          </div>

          <div className="flex flex-row items-center gap-4">
            <div className="relative">
              <div
                className="flex cursor-pointer flex-row items-center gap-2 dark:text-sky-500"
                onClick={() => setOpenSort(true)}
              >
                <FaSortAmountUp />
                Sort
              </div>

              {openSort && (
                <>
                  <div
                    className="fixed inset-0 z-10 h-full w-full"
                    onClick={() => setOpenSort(false)}
                  ></div>
                  <div className="absolute right-0 top-8 z-20 flex min-w-max flex-col gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 shadow-md dark:border-sky-500 dark:bg-sky-500">
                    <InputSelect
                      name="created_at"
                      label="Created At"
                      placeholder="Select sort option"
                      control={control}
                      options={sortOptions}
                      passValue={onSortCreatedAt}
                    />
                    <InputSelect
                      name="title"
                      label="Title"
                      placeholder="Select sort option"
                      control={control}
                      options={sortOptions}
                      passValue={onSortTitle}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <div
                className="flex cursor-pointer flex-row items-center gap-2 dark:text-sky-500"
                onClick={() => setOpenFilter(true)}
              >
                <FaFilter />
                Filter
              </div>

              {openFilter && (
                <>
                  <div
                    className="fixed inset-0 z-10 h-full w-full"
                    onClick={() => setOpenFilter(false)}
                  ></div>
                  <div className="absolute right-0 top-8 z-20 flex min-w-max flex-col gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 shadow-md dark:border-sky-500 dark:bg-sky-500">
                    <InputSelect
                      name="priority"
                      label="Priority"
                      placeholder="Select priority"
                      control={control}
                      options={priorityFilterOptions}
                      passValue={onFilterPriority}
                    />
                    <InputSelect
                      name="status"
                      label="Status"
                      placeholder="Select status"
                      control={control}
                      options={statusFilterOptions}
                      passValue={onFilterStatus}
                    />
                  </div>
                </>
              )}
            </div>
            <AddTickets onSuccessAdd={getData} />
          </div>
        </div>

        <table className="table-auto">
          <thead>
            <tr className="border-b-2 text-left dark:text-sky-500">
              <th className="p-4 pl-2">Title</th>
              <th className="p-4">Customer name</th>
              <th className="p-4">Created at</th>
              <th className="p-4">Priority</th>
              <th className="p-4 pr-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                className={`hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-sky-950 ${index === data.length - 1 ? "" : "border-b"}`}
                key={item.id}
              >
                <td className="p-4 pl-2">
                  <Link
                    href={`/tickets/${item.id}`}
                    className="font-semibold text-sky-500 decoration-sky-500 underline-offset-2 hover:underline dark:text-white dark:decoration-white"
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                </td>
                <td className="p-4">{item.customer_name}</td>
                <td className="p-4">{item.created_at}</td>
                <td className="p-4">
                  <span
                    className={`w-fit rounded-md px-3 py-1 text-sm font-semibold uppercase text-white ${getPriorityStyle(item.priority)}`}
                  >
                    {item.priority}
                  </span>
                </td>
                <td className="p-4 pr-2">
                  <span
                    className={`w-fit rounded-md px-3 py-1 text-sm font-semibold uppercase text-white ${getStatusStyle(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Tickets;
