import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import moment from "moment";

import { useLayoutStore } from "@/stores/layout";

import {
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

import { FaFilter } from "react-icons/fa";
import InputSelect from "@/components/global/input/Select";
import { FirestoreParams } from "@/src/types";

const validationSchema = yup.object({
  priority: yup.string().required().label("Priority Task"),
  status: yup.string().required().label("Title Task"),
});

const Tasks = () => {
  const { control, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();
  const { setBreadcrumb, errorHandler, setAlert } = useLayoutStore();

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [data, setData] = useState<FirestoreParams[]>([]);

  const priorityFilterOptions = [
    { value: "urgent", label: "Urgent" },
    { value: "schedule", label: "Schedule" },
    { value: "delegate", label: "Delegate" },
    { value: "normal", label: "Normal" },
  ];
  const statusFilterOptions = [
    { value: "done", label: "Done" },
    { value: "not-done", label: "Not Done" },
  ];

  const getData = async () => {
    try {
      const { priority, status, search } = router.query;
      var constraints = [];

      if (priority) {
        constraints.push(where("priority", "==", priority));
      }
      if (status) {
        constraints.push(
          where("status", "==", status === "done" ? true : false),
        );
      }
      if (search) {
        const stringSearch = search as string;
        constraints.push(where("low_title", "==", stringSearch.toLowerCase()));
      }

      const q = query(
        collection(firestoreDB, "tasks"),
        orderBy("created_at", "desc"),
        ...constraints,
      );
      const response = await getDocs(q);

      setData(
        response.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: moment(doc.data().created_at.nanoseconds).format(
            "MMMM Do YYYY, h:mm:ss a",
          ),
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

  const updateStatusTask = async (id: string) => {
    try {
      const isDone = await getDoc(doc(firestoreDB, "tasks", id));

      isDone.exists() &&
        (await updateDoc(doc(firestoreDB, "tasks", id), {
          done: !isDone.data().done,
          updated_at: serverTimestamp(),
        }));
      await getData();
      setAlert({
        type: "success",
        title: "Task Updated",
        message: "Succesfully updated task",
        show: true,
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  const getPriorityStyle = (value: string) => {
    switch (value) {
      case "urgent":
        return "bg-red-500";
      case "schedule":
        return "bg-yellow-500";
      case "delegate":
        return "bg-blue-500";
      default:
        return "bg-slate-300";
    }
  };

  useEffect(() => {
    setBreadcrumb(["Tasks"]);
    getData();
    setValue("priority", router.query?.priority as string);
    setValue("status", router.query?.status as string);
  }, [router.query]);

  return (
    <MainLayout title="List Tasks">
      <div className="flex w-full flex-col gap-4 rounded-lg bg-white px-8 py-6 shadow-md">
        <div className="flex flex-row items-center justify-end gap-4">
          <div className="relative">
            <div
              className="flex cursor-pointer flex-row items-center gap-2"
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
                <div className="absolute right-0 top-8 z-20 flex min-w-max flex-col gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 shadow-md">
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
        </div>

        <div className="mb-4 grid grid-cols-1 divide-y">
          <table>
            <thead>
              <tr className="border-b-2 text-left">
                <th className="p-4 pl-0"></th>
                <th className="p-4">Title</th>
                <th className="p-4">Created at</th>
                <th className="p-4 pr-0">Priority</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr className="border-b">
                  <td className="p-4 pl-0">
                    <input
                      type="checkbox"
                      name={`task ${item.id}`}
                      className="h-5 w-5 rounded-full border border-slate-950 text-slate-950 focus:!ring-2 focus:!ring-slate-950"
                      onChange={() => updateStatusTask(item.id)}
                      checked={item.status}
                    />
                  </td>
                  <td className="p-4">{item.title}</td>
                  <td className="p-4">{item.created_at}</td>
                  <td className="p-4 pr-0">
                    <span
                      className={`w-fit rounded-md px-3 py-1 text-sm font-semibold uppercase text-white ${getPriorityStyle(item.priority)}`}
                    >
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tasks;
