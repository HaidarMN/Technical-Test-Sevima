import { useEffect, useState } from "react";
import Link from "next/link";
import { useLayoutStore } from "@/stores/layout";
import { useRouter } from "next/router";

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
} from "firebase/firestore";
import { firestoreDB } from "@/src/plugins/firebase";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Modal from "@/components/global/popUp/Modal";
import InputText from "@/components/global/input/Text";
import Button from "@/components/global/button";
import InputSelect from "@/components/global/input/Select";

import { CreateTasksType, FirestoreParams } from "@/src/types";
import Spinner from "../global/loader/Spinner";
import { GoKebabHorizontal } from "react-icons/go";

const validationSchema = yup.object({
  title: yup.string().required().label("Title Task"),
  status: yup.string().required().label("Status Task"),
});

const CardTask = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();
  const { errorHandler, setAlert } = useLayoutStore();

  const [isAddTask, setIsAddTask] = useState<boolean>(false);
  const [loadingCreateTask, setLoadingCreateTask] = useState<boolean>(false);
  const [data, setData] = useState<FirestoreParams[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const statusTaskOptions = [
    { value: "urgent", label: "Urgent" },
    { value: "schedule", label: "Schedule" },
    { value: "delegate", label: "Delegate" },
    { value: "normal", label: "Normal" },
  ];

  const onCloseModalCreateTask = () => {
    setIsAddTask(false);
    reset();
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(firestoreDB, "tasks"),
        orderBy("created_at", "desc"),
        limit(5),
      );
      const response = await getDocs(q);
      setData(
        response.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          status: doc.data().status,
          done: doc.data().done,
        })),
      );
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (value: CreateTasksType) => {
    try {
      setLoadingCreateTask(true);
      await addDoc(collection(firestoreDB, "tasks"), {
        ...value,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        done: false,
      });
      await getData();
      setAlert({
        type: "success",
        title: "Task Created",
        message: "Succesfully created task",
        show: true,
      });
      onCloseModalCreateTask();
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoadingCreateTask(false);
    }
  };

  const updateDoneTask = async (id: string) => {
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

  const getStatusStyle = (value: string) => {
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
    getData();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white shadow-md">
      <div className="flex w-full flex-row items-start justify-between px-8 pt-6">
        <span className="text-xl font-bold">Tasks</span>

        <div className="relative">
          <GoKebabHorizontal
            className="rotate-90 cursor-pointer text-xl"
            onClick={() => setOpenMenu(true)}
          />
          {openMenu && (
            <>
              <div
                className="fixed inset-0 z-10 h-full w-full"
                onClick={() => setOpenMenu(false)}
              ></div>
              <div className="absolute right-0 top-6 z-20 grid w-40 grid-cols-1 divide-y rounded-lg border border-slate-300 bg-white shadow-md">
                <span
                  onClick={() => {
                    setIsAddTask(true);
                    setOpenMenu(false);
                  }}
                  className="cursor-pointer px-4 py-2"
                >
                  Create Task
                </span>
                <span
                  onClick={() => router.push("/task")}
                  className="cursor-pointer px-4 py-2"
                >
                  View all
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mb-4 grid grid-cols-1 divide-y">
          {data.map((item) => (
            <div
              className="flex flex-row items-center justify-between px-8 py-4"
              key={item.id}
            >
              <div className="flex flex-row items-center gap-2">
                <input
                  type="checkbox"
                  name={`task ${item.id}`}
                  className="h-5 w-5 rounded-full border border-slate-950 text-slate-950 focus:!ring-2 focus:!ring-slate-950"
                  onChange={() => updateDoneTask(item.id)}
                  checked={item.done}
                />
                <Link
                  href={`/task?search=${item.title}`}
                  className="font-semibold text-slate-500 decoration-slate-500 underline-offset-2 hover:underline"
                  title={item.title}
                >
                  {item.title}
                </Link>
              </div>
              <span
                className={`rounded-md px-3 py-1 text-sm font-semibold uppercase text-white ${getStatusStyle(item.status)}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isAddTask}>
        <h1 className="text-xl font-bold">Create Task</h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(createTask)}
        >
          <InputText
            name="title"
            control={control}
            label="Title Task"
            placeholder="Add some title"
            error={errors.title?.message}
            primary
          />
          <InputSelect
            name="status"
            control={control}
            label="Status Task"
            placeholder="Add some title"
            error={errors.status?.message}
            primary
            options={statusTaskOptions}
          />

          <div className="flex w-full flex-row items-center justify-end gap-2">
            <Button onClick={onCloseModalCreateTask}>Cancel</Button>
            <Button type="submit" primary isLoading={loadingCreateTask}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CardTask;
