import { usePathname } from "next/navigation";
import { useLayoutStore } from "@/stores/layout";
import Link from "next/link";

const Breadcrumb = () => {
  const pathname = usePathname();
  const { breadcrumbs_list } = useLayoutStore();

  // Variabel
  const location_path = pathname.split("/");
  const breadcrumbs = breadcrumbs_list.map((val: string, index: number) => {
    return {
      label: val,
      path: `/${location_path.slice(1, index + 2).join("/")}`,
    };
  });

  return (
    <div className="flex flex-row items-center gap-2">
      {breadcrumbs.map((val: any, index: number) =>
        index + 1 == breadcrumbs.length ? (
          <Link
            href={val.path}
            key={index}
            className="text-sm font-bold text-slate-950"
          >
            {val.label}
          </Link>
        ) : (
          <>
            <Link
              href={val.path}
              key={index}
              className={`text-sm ${index + 1 === breadcrumbs.length ? "font-bold text-slate-950" : "text-slate-700"}`}
            >
              {val.label}
            </Link>
            <span>/</span>
          </>
        ),
      )}
    </div>
  );
};

export default Breadcrumb;
