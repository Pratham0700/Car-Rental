import Title from "../../component/owner/Title";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ICarFormValues } from "../../Data/AppInterface";
import { CarCategory, CarFuel, CarTransmission } from "../../Data/AppEnum";
import { assets } from "../../assets/assets";


import ToastMessage from "../../component/Toast/ToastMessage";
import { MessageType } from "../../Data/AppEnum";
import axiosInstance from "../../component/axiosInstance";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
const IMAGE_FILE_SIZE = 2 * 1024 * 1024;
const IMAGE_MIMETYPE = ["image/jpg", "image/jpeg", "image/png"];

const isAllowedImage = (file: File) => {
  const fileType = file.type.toLowerCase();
  const fileExt = file.name.toLowerCase().split(".").pop() || "";

  return (
    file instanceof File &&
    (IMAGE_MIMETYPE.includes(fileType) ||
      ["jpg", "jpeg", "png"].includes(fileExt)) &&
    file.size <= IMAGE_FILE_SIZE
  );
};

// ── Validation Schema ──────────────────────────────────────────────────────
const validationSchema = Yup.object({
  image: Yup.array()
    .of(Yup.mixed<File>())
    .min(1, "At least one car image is required")
    .max(6, "You can upload up to 6 photos")
    .test("fileType", "Only JPG/PNG images under 2MB are allowed", (value) => {
      if (!value || value.length === 0) return false;
      return value.every(
        (file) => file instanceof File && isAllowedImage(file),
      );
    }),
  brand: Yup.string().trim().required("Brand is required"),
  model: Yup.string().trim().required("Model is required"),
  year: Yup.number()
    .typeError("Year must be a number")
    .required("Year is required")
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year is too far in the future"),
  daily_price: Yup.number()
    .typeError("Price must be a number")
    .required("Daily price is required")
    .min(1, "Price must be at least $1"),
  category: Yup.string().required("Category is required"),
  transmission: Yup.string().required("Transmission is required"),
  fuel_type: Yup.string().required("Fuel type is required"),
  seating_capacity: Yup.number()
    .typeError("Seating capacity must be a number")
    .required("Seating capacity is required")
    .min(2, "Must have at least 2 seat")
    .max(15, "Cannot exceed 15 seats"),
  description: Yup.string().trim().min(200,"Minimum 200 ").max(600,"maximium 600 ").required("Description is required"),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be of 6 numbers")
    .required("Pincode is required"),
  address: Yup.string().trim().required("Address is required"),
  car_number: Yup.string()
    .required("Car number is required")
    .matches(
      /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/,
      "Enter a valid vehicle number",
    ),
});

// ── Reusable Field Components ──────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  id: string;
  placeholder: string;
  type?: string;
  value: string;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  readonly?: boolean;
  customError?: string;
}

function InputField({
  label,
  id,
  placeholder,
  type = "text",
  value,
  min,
  max,
  onChange,
  onBlur,
  error,
  touched,
  readonly,
  customError,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readonly}
        min={min}
        max={max}
        className={`w-full px-3 py-2 placeholder:font-sans text-sm text-gray-700 placeholder-gray-400 bg-white border rounded-md outline-none transition-colors
          ${
            touched && error
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          }`}
      />

      {touched && (error || customError) && (
        <p className="text-xs text-red-500 mt-0.5">{error || customError}</p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  error?: string;
  touched?: boolean;
  customError?: string;
}

function SelectField({
  label,
  id,
  value,
  onChange,
  onBlur,
  options,
  error,
  touched,
  placeholder,
  customError,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-3 py-2 text-sm placeholder:font-sans text-gray-700 bg-white border rounded-md outline-none transition-colors
          ${
            touched && error
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {touched && (error || customError) && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
}
const AddCar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string[] | null>(null);
  const [areas, setAreas] = useState<any[]>([]);
  const [pincodeError, setPincodeError] = useState("");
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [loading, setloading] = useState(false)
  const navigate =useNavigate()
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if(!user.profile?.phone_no){
      ToastMessage(MessageType.Warning,"Complete profile first");
    }
  }, [])
  
  const formik = useFormik<ICarFormValues>({
    initialValues: {
      image: null,
      brand: "",
      model: "",
      year: "",
      daily_price:"",
      category: "",
      transmission: "",
      fuel_type: "",
      seating_capacity: "",
      description: "",
      pincode: "",
      state: "",
      city: "",
      area: "",
      address: "",
      car_number: "",
    },
    validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      if (!pincodeVerified) {
        setFieldError("pincode", "Invalid pincode");
        setPincodeError("Invalid pincode");
        return;
      }
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: ICarFormValues) => {
    
    if (!values.image) {
            ToastMessage(MessageType.Error,"Please upload at least one image of the car.");
      return;
    }
    if(!user.profile?.phone_no)
    {
            ToastMessage(MessageType.Warning,"Complete profile first");
      navigate("/profile");
      return;
      
    }
    setloading(true);
    try {
      const image_paths = await handleImages(values.image); 
      // Create payload without image file, add image_path instead
      const carData = {
        brand: values.brand,
        model: values.model,
        year: values.year,
        daily_price: values.daily_price,
        category: values.category,
        transmission: values.transmission,
        fuel_type: values.fuel_type,
        seating_capacity: values.seating_capacity,
        description: values.description,
        pincode: values.pincode,
        state: values.state,
        city: values.city,
        area: values.area,
        car_number: values.car_number,
        address: values.address,
        image_paths: image_paths,
      };
      // Call post car detail API
      const response = await axiosInstance.post("/car", carData);
        ToastMessage(MessageType.Success,response.data.message);
        formik.resetForm();
        setPreviewUrl(null);
        setPincodeVerified(false);
        setAreas([]);
      
    } catch (e:any) {
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
    finally{
      setloading(false)
    }
  };

  const handleImages = async (files: File[]) => {
  const uploadPromises = files.map((file) => {
    const formData = new FormData();
    formData.append("profileimage", file);
    return axiosInstance.post("/upload", formData);
  });

  const responses = await Promise.all(uploadPromises);
  const images = responses.map((res) => res.data.data.imagePath);

  return images;
};

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = files.filter((file) => isAllowedImage(file));
    const invalidFiles = files.filter((file) => !isAllowedImage(file));
    const limitedFiles = validFiles.slice(0, 6);

    formik.setFieldTouched("image", true, false);
    formik.setFieldValue("image", limitedFiles);

    if (files.length > 6) {
              ToastMessage(MessageType.Info,"Only the first 6 images were accepted.Please upload up to 6 photos.");
      formik.setFieldError("image", "You can upload up to 6 photos");
    } else if (invalidFiles.length > 0) {
      ToastMessage(MessageType.Error,"Some files were invalid. Only JPG/PNG images under 2MB are allowed.");
      formik.setFieldError(
        "image",
        "Each image must be JPG/PNG and no larger than 2MB",
      );
    } else {
      formik.setFieldError("image", "");
    }

    const urls = limitedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrl(urls);
  }

  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const pin = e.target.value;

    formik.setFieldValue("pincode", pin);

    // touch only pincode field
    formik.setFieldTouched("pincode", true);

    // clear old error
    setPincodeError("");
    // mark unverified until API confirms
    setPincodeVerified(false);

    if (pin.length === 6) {
      try {
        const res = await axiosInstance.get(`/pincode/${pin}`);

        const data = res.data.data;

        // invalid response
        if (!data?.areas?.length) {
          setPincodeError("Invalid pincode");

          // mark field error in Formik so validation fails on submit
          formik.setFieldError("pincode", "Invalid pincode");

          setAreas([]);

          formik.setFieldValue("city", "");
          formik.setFieldValue("state", "");
          formik.setFieldValue("area", "");

          return;
        }

        setAreas(data.areas);

        // clear any previous pincode error and mark as verified
        setPincodeError("");
        formik.setFieldError("pincode", "");
        setPincodeVerified(true);

        formik.setFieldValue("city", data.city);
        formik.setFieldValue("state", data.state);
        formik.setFieldValue("area", data.areas[0]);
      } catch (e:any) {
        const statuscode = e.response.status;
        if(statuscode === 400)
        {
          setPincodeError("Invalid pincode");
        formik.setFieldError("pincode", "Invalid pincode");

        }
        else{
          
                ToastMessage(MessageType.Error,"Server Error try again later");
        }
        setAreas([]);
        formik.setFieldValue("city", "");
        formik.setFieldValue("state", "");
        formik.setFieldValue("area", "");
      }
    }
  };
  return (
    <>
      <div className="space-y-6 relative">
        {loading && <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black/20 disabled:cursor-not-allowed backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
    </div>}
    
  
        <Title
          title={"Add New Car"}
          subtitle={
            "Fill in details to list a new car for booking, including pricing, availability, and car specifications."
          }
        />
        {/* Form fields will be added here */}
        <form
          onSubmit={formik.handleSubmit}
          noValidate
          className="w-full max-w-2xl"
        >
          {/* ── Image Upload ── */}
          <div className="mb-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="flex flex-wrap gap-3">
              {/* Preview tiles */}
              {previewUrl?.map((url, index) => (
                <div
                  key={index}
                  className="w-24 h-20 rounded-md overflow-hidden border border-gray-200"
                >
                  <img
                    src={url}
                    alt={`Car preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-24 h-20 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-1 bg-white transition-colors
        ${
          formik.submitCount > 0 && formik.errors.image
            ? "border-red-400"
            : "border-gray-300 hover:border-blue-400"
        }`}
              >
                <img
                  src={assets.upload_icon}
                  alt="upload"
                  className=" h-full w-full object-cover"
                />
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Upload pictures of your car (max 6 photos, JPG/PNG only)
            </p>
            {(formik.touched.image || formik.submitCount > 0) &&
              formik.errors.image && (
                <p className="text-xs text-red-500 mt-0.5">
                  {formik.errors.image as string}
                </p>
              )}
          </div>

          {/* ── Brand + Model ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <InputField
              label="Brand"
              id="brand"
              placeholder="e.g. BMW, Mercedes, Audi..."
              value={formik.values.brand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.brand}
              touched={formik.submitCount > 0}
            />
            <InputField
              label="Model"
              id="model"
              placeholder="e.g. X5, E-Class, M4..."
              value={formik.values.model}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.model}
              touched={formik.submitCount > 0}
            />
          </div>

          {/* ── Year + Daily Price + Category ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Year"
              id="year"
              placeholder="2025"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              value={formik.values.year}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.year}
              touched={formik.submitCount > 0}
            />
            <InputField
              label="Daily Price "
              id="daily_price"
              placeholder="₹1000"
              min={1}
              type="number"
              value={formik.values.daily_price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.daily_price}
              touched={formik.submitCount > 0}
            />
            <SelectField
              label="Category"
              id="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={Object.values(CarCategory).map((v) => ({
                label: v,
                value: v,
              }))}
              error={formik.errors.category}
              touched={formik.submitCount > 0}
              placeholder="Select a category"
            />
          </div>

          {/* ── Transmission + Fuel Type + Seating Capacity ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <SelectField
              label="Transmission"
              id="transmission"
              value={formik.values.transmission}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={Object.values(CarTransmission).map((v) => ({
                label: v,
                value: v,
              }))}
              error={formik.errors.transmission}
              touched={formik.submitCount > 0}
              placeholder="Select a transmission"
            />
            <SelectField
              label="Fuel Type"
              id="fuel_type"
              value={formik.values.fuel_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={Object.values(CarFuel).map((v) => ({
                label: v,
                value: v,
              }))}
              error={formik.errors.fuel_type}
              touched={formik.submitCount > 0}
              placeholder="Select a FuelType"
            />
            <InputField
              label="Seating Capacity"
              id="seating_capacity"
              placeholder="5"
              type="number"
              min={2}
              max={15}
              value={formik.values.seating_capacity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.seating_capacity}
              touched={formik.submitCount > 0}
            />
          </div>
          <div className="mb-4">
            <InputField
              label="Address"
              id="address"
              placeholder="Address Line . . . . ."
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.address}
              touched={formik.submitCount > 0}
            />
          </div>
          {/* ── pincode + State + City ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Pincode"
              id="pincode"
              placeholder="eg.380001"
              min={100000}
              max={999999}
              value={formik.values.pincode}
              onChange={handlePincodeChange}
              onBlur={formik.handleBlur}
              error={formik.errors.pincode}
              customError={pincodeError}
              touched={formik.submitCount > 0 || formik.touched.pincode}
            />

            <InputField
              label="City"
              id="city"
              placeholder="eg.Ahmedabad"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.city}
              touched={formik.submitCount > 0}
              readonly
            />
            <InputField
              label="State"
              id="state"
              placeholder="eg.Gujarat"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.state}
              touched={formik.submitCount > 0}
              readonly
            />
          </div>
          {/* ── Location ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <SelectField
              label="Area"
              id="area"
              value={formik.values.area}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={areas.map((a) => ({
                label: a,
                value: a,
              }))}
              error={formik.errors.area}
              touched={formik.submitCount > 0}
              placeholder="Select an area"
            />
            <InputField
              label="Car Number"
              id="car_number"
              placeholder="e.g. GJ01AB1234"
              value={formik.values.car_number}
              onChange={(e) => {
                formik.setFieldValue(
                  "car_number",
                  e.target.value.toUpperCase(),
                );
              }}
              onBlur={formik.handleBlur}
              error={formik.errors.car_number}
              touched={formik.submitCount > 0}
            />
          </div>

          {/* ── Description ── */}
          <div className="flex flex-col gap-1 mb-6">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="e.g. A well-maintained SUV with spacious interior, perfect for family trips. Comes with advanced safety features and a powerful engine for a smooth ride."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 placeholder:font-sans bg-white border rounded-md outline-none resize-none transition-colors
            ${
              formik.submitCount > 0 && formik.errors.description
                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            }`}
            />
            {formik.submitCount > 0 && formik.errors.description && (
              <p className="text-xs text-red-500 mt-0.5">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* ── Submit Button ── */}
          <div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {/* Checkmark icon */}
              <img src={assets.tick_icon} alt="checkmark" className="w-5 h-5" />
              List Your Car
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCar;
