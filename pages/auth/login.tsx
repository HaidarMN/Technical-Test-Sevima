import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthLayout from "@/layouts/AuthLayout";

// Stores
import { useAuthStore } from "@/stores/auth";
import { useLayoutStore } from "@/stores/layout";

// Components
import InputText from "@/components/global/input/Text";
import InputPassword from "@/components/global/input/Password";
import InputCaptcha from "@/components/global/input/Captcha";

const validationSchema = yup.object({
  email: yup.string().email().required().label("Email"),
  password: yup.string().required().min(8).label("Password"),
});

type LoginType = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Variabel
  const router = useRouter();
  const { setAuth: setAuth } = useAuthStore();
  const {
    setIsLoading: setIsLoading,
    setAlert: setAlert,
    errorHandler: errorHandler,
  } = useLayoutStore();
  const [is_captcha_match, setIsCaptchaMatch] = useState(false);

  // Funtion
  const submitData = async (data: LoginType) => {
    try {
      if (!is_captcha_match) {
        return setAlert({
          type: "warning",
          title: "Captcha Not Match",
          message: "Please re-enter or change the Captcha",
          show: true,
        });
      }
      setIsLoading(true);

      if (data.email === "admin@admin.com" && data.password === "admin123") {
        setAuth({ email: data.email, role: "admin" });
        router.push("/");
      } else if (
        data.email === "guest@guest.com" &&
        data.password === "guest123"
      ) {
        setAuth({ email: data.email, role: "guest" });
        router.push("/tickets");
      } else {
        throw new Error("Please enter the correct credential");
      }

      setAlert({
        type: "success",
        title: "Login Success",
        message: `Welcome aboard, ${data.email}!`,
        show: true,
      });
    } catch (error: any) {
      setAlert({
        type: "danger",
        title: "Login Failed",
        message: error.message,
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login">
      <div className="flex w-96 flex-col gap-4 rounded-lg bg-white p-8 shadow-md dark:bg-slate-950">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-center text-2xl font-bold dark:text-sky-500">
            Log In to Dashboard Kit
          </h1>
          <span className="text-sm text-slate-400">
            Enter your email and password below
          </span>
        </div>

        <form
          onSubmit={handleSubmit(submitData)}
          className="flex flex-col gap-4"
        >
          <InputText
            name="email"
            control={control}
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message}
            primary
          />
          <InputPassword
            name="password"
            control={control}
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            primary
          />
          <InputCaptcha passValue={(e) => setIsCaptchaMatch(e)} />

          <button
            type="submit"
            className="rounded-md border border-slate-300 px-4 py-2 font-medium transition-all duration-200 hover:bg-slate-950 hover:text-white dark:border-sky-500 dark:text-sky-500 dark:hover:bg-sky-500"
          >
            Submit
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
