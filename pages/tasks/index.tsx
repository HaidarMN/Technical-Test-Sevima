import MainLayout from "@/layouts/MainLayout";
import { useLayoutStore } from "@/stores/layout";
import { useEffect } from "react";

const Tasks = () => {
  const { setBreadcrumb, errorHandler } = useLayoutStore();

  useEffect(() => {
    setBreadcrumb(["Tasks"]);
  }, []);

  return (
    <MainLayout title="List Tasks">
      <h1>apapa</h1>
    </MainLayout>
  );
};

export default Tasks;
