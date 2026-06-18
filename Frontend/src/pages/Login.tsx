"use client";
import * as yup from "yup";
import { useFormik, type FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { fetchProfile } from "../store/user/userSlice";
import { BASE_URL } from "../config/AppConfig";
import { fetchCars } from "../store/cars/carSlice";
import ToastMessage from "../component/Toast/ToastMessage";
import { MessageType } from "../Data/AppEnum";

type LoginProps = {
  setshowlogin: React.Dispatch<React.SetStateAction<boolean>>;
};
interface IFormValues {
  email: string;
  password: string;
}
const validationSchema = yup.object<IFormValues>({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
export default function Login({ setshowlogin }: LoginProps) {
   const navigate = useNavigate();
   const dispatch = useDispatch<AppDispatch>()
   
  const [visible, setvisible] = useState<boolean>(false);    
    useEffect(() => {
setshowlogin(true)
    
      return () => {
        setshowlogin(false)
      }
    }, [])
    
    const formik = useFormik<IFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (
      values: IFormValues,
      { resetForm }: FormikHelpers<IFormValues>,
    ) => {
      try {
        const data = {
          email: values.email.trim(),
          password: values.password.trim(),
        };
        const response = await login(data);
        ToastMessage(MessageType.Success,response.data.message)
        resetForm();
        navigate("/",{ replace: true });
      } catch (e: any) {
        const statuscode = e.response.status;
        if(statuscode === 400)
        {
          ToastMessage(MessageType.Error,e.response.data.message)
        }
        else if(statuscode === 404)
        {
          ToastMessage(MessageType.Error,"E-Mail is not Registered yet.")
        }
        else if(statuscode === 401)
        {
          ToastMessage(MessageType.Error,"Enter Valid Password")
        }
        else{
          ToastMessage(MessageType.Error,"Server Issue please Try again later")
        }
      }
    },
  });

  const login = async(data:IFormValues) =>
  {
    try{const response = await axios.post(`${BASE_URL}/login`, data);
    localStorage.setItem("refreshtoken", response.data.data.refreshtoken);
    localStorage.setItem("accesstoken", response.data.data.accesstoken);
    await dispatch(fetchProfile());
    return response
  }
  catch(error){
    throw error;
  }
  }
  return (
    <div className="flex relative h-screen w-full ">

    <div className="flex  w-full ">
       <img
            src={assets.login_image}
            alt="Luxury car on road"
            className="w-full h-full object-cover object-center"
          />
    </div>

      {/* ══ RIGHT PANEL — form ══ */}
      <div className="absolute top-0 right-0 h-screen w-full lg:w-5/12 flex justify-center items-center">
         <div className="flex flex-col items-center max-w-md w-full bg-black/30 p-5 rounded-3xl">
            <h1 className="text-4xl font-bold text-white mb-5 text-center">
              Welcome To Wheeler
            </h1>
            <p className="text-lg text-white mb-5">
              Please login to your account
            </p>
            <form
              onSubmit={formik.handleSubmit}
              className="text-white w-full flex flex-col gap-2"
            >
              <div className="w-full flex-col flex gap-1 font-medium">
                <p className="text-2xl">email</p>
                <div className="bg-white w-full p-1 rounded-xl flex ">
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-transparent outline-none text-black rounded-md w-full text-xl py-1.5 px-3"
                  />
                </div>
                <p className="text-red-500 text-sm mt-1 h-4">
                  {formik.touched.email &&
                    formik.errors.email &&
                    formik.errors.email}
                </p>
              </div>
              <div className="w-full flex-col flex gap-1 font-medium">
                <p className="text-2xl">Password</p>
                <div className="bg-white w-full p-1 rounded-xl flex ">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-white outline-none text-black rounded-md w-full text-xl py-1.5 px-3 accent-black"
                  />
                  <div className=" flex justify-center items-center mx-1.5">
                    <div
                      className=" size-8 rounded-md flex justify-center items-center cursor-pointer "
                      onClick={() => {
                        setvisible(!visible);
                      }}
                    >
                      <img src={visible ? assets.eye_icon : assets.eye_close_icon} alt="eye icon"  className="h-full w-full "/>
                    </div>
                  </div>
                </div>
                <p className="text-red-500 text-sm mt-1 h-4">
                  {formik.touched.password &&
                    formik.errors.password &&
                    formik.errors.password}
                </p>
              </div>
              <button
                type="submit"
                className="bg-blue-700 mt-4 text-white text-2xl font-bold py-2 px-4 rounded-xl"
              >
                Login
              </button>
            </form>
            <p className="text-white mt-4 text-lg">
              Don't have an account ?{" "}
              <a
                href="/register"
                className="text-blue-500 underline font-semibold"
              >
                Register
              </a>
            </p>
          </div>
      </div>
    </div>
  );
}