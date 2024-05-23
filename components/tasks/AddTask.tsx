import { FC, useState } from "react";
import { useLayoutStore } from "@/stores/layout";

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

import Button from "../global/button";
import InputSelect from "../global/input/Select";
import InputText from "../global/input/Text";
import Modal from "../global/popUp/Modal";

import { CreateTasksType } from "@/src/types";

type AddTaskType = {
  onSuccessAdd: () => void;
};

const validationSchema = yup.object({
  title: yup.string().required().label("Title Task"),
  priority: yup.string().required().label("Priority Task"),
});

const AddTask: FC<AddTaskType> = ({ onSuccessAdd }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { errorHandler, setAlert } = useLayoutStore();

  const [isAddTask, setIsAddTask] = useState<boolean>(false);
  const [loadingCreateTask, setLoadingCreateTask] = useState<boolean>(false);

  const priorityTaskOptions = [
    { value: "urgent", label: "Urgent" },
    { value: "schedule", label: "Schedule" },
    { value: "delegate", label: "Delegate" },
    { value: "normal", label: "Normal" },
  ];

  const onCloseModalCreateTask = () => {
    setIsAddTask(false);
    reset();
  };

  const createTask = async (value: CreateTasksType) => {
    try {
      setLoadingCreateTask(true);
      await addDoc(collection(firestoreDB, "tasks"), {
        ...value,
        low_title: value.title.toLowerCase(),
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        done: false,
      });
      onSuccessAdd();
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

  return (
    <>
      <Button primary onClick={() => setIsAddTask(true)}>
        Add Task
      </Button>

      <Modal isOpen={isAddTask}>
        <h1 className="text-xl font-bold dark:text-white">Add Task</h1>

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
            name="priority"
            control={control}
            label="Priority Task"
            placeholder="Choose the priority"
            error={errors.priority?.message}
            primary
            options={priorityTaskOptions}
          />

          <div className="flex w-full flex-row items-center justify-end gap-2">
            <Button onClick={onCloseModalCreateTask}>Cancel</Button>
            <Button type="submit" primary isLoading={loadingCreateTask}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddTask;
