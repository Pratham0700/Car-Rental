"use client";
import * as yup from "yup";
import { useFormik, type FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {BASE_URL} from '../config/AppConfig'

import ToastMessage from "../component/Toast/ToastMessage";
import { MessageType } from "../Data/AppEnum";
type LoginProps = {
  setshowlogin: React.Dispatch<React.SetStateAction<boolean>>;
};
interface IFormValues {
    name:string
  email: string;
  password: string;
}
const validationSchema = yup.object<IFormValues>({
    
  name: yup.string().trim().min(2, "Name must be at least 2 characters!").required("Name is required!"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
export default function Register({ setshowlogin }: LoginProps) {
   const navigate = useNavigate();
   
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
      name:""
    },
    validationSchema,
    onSubmit: async (
      values: IFormValues,
      { resetForm }: FormikHelpers<IFormValues>,
    ) => {

      try { 
        const data = {
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password.trim(),
        };
        const response = await register(data);
        ToastMessage(MessageType.Success,response.data.message);
        navigate("/login",{ replace: true });
      } catch (e: any) {
        const statuscode = e.response.status;
        if(statuscode === 400)
        {
          ToastMessage(MessageType.Error,e.response.data.message);
        }
        else if(statuscode === 409)
        {
          ToastMessage(MessageType.Error,e.response.data.message);
        }
        else{
        ToastMessage(MessageType.Error,"Server Error try again later");
        }
      }
    },
  });

  const register = async (data: IFormValues) => {

      const response = await axios.post(`${BASE_URL}/register`,data);
      return response
  }
  return (
    <div className="flex relative h-screen w-full ">

    <div className="flex bg-red-600 w-full ">
       <img
            src={assets.login_image}
            alt="Luxury car on road"
            className="w-full h-full object-cover object-center"
          />
    </div>

      {/* ══ RIGHT PANEL — form ══ */}
      <div className="absolute top-0 right-0 h-screen  lg:w-5/12 w-full flex justify-center items-center">
         <div className="flex flex-col items-center max-w-md w-full bg-black/40 p-5 rounded-3xl">
            <h1 className="text-4xl font-bold text-white mb-5 self-center text-center">
              Sign Up To Wheeler
            </h1>
            <p className="text-lg text-white mb-5">
              Please create your account
            </p>
            <form
              onSubmit={formik.handleSubmit}
              className="text-white w-full flex flex-col gap-2"
            >
                <div className="w-full flex-col flex gap-1 font-medium">
                <p className="text-2xl">Name</p>
                <div className="bg-white w-full p-1 rounded-xl flex ">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-transparent outline-none text-black rounded-md w-full text-xl py-1.5 px-3"
                  />
                </div>
                <p className="text-red-500 text-sm mt-1 h-4">
                  {formik.touched.name && formik.errors.name && formik.errors.name}
                </p>
              </div>
              <div className="w-full flex-col flex gap-1 font-medium">
                <p className="text-2xl">E-Mail</p>
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
                Register
              </button>
            </form>
            <p className="text-white mt-4 text-lg">
              Already have an account ?{" "}
              <a
                href="/login"
                className="text-blue-500 underline font-semibold"
              >
                Login
              </a>
            </p>
          </div>
      </div>
    </div>
  );
}