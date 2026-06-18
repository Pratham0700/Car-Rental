import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { RootState, AppDispatch } from "../store/store";
import axiosInstance from "../component/axiosInstance";
import {logout, updateUser } from "../store/user/userSlice";
import { assets } from "../assets/assets";
import CancelModal from "../component/CancelModal";

import ToastMessage from "../component/Toast/ToastMessage";
import { MessageType } from "../Data/AppEnum";
const IMAGE_FILE_SIZE = 2 * 1024 * 1024;
const IMAGE_MIMETYPE = ["image/jpg", "image/jpeg", "image/png"];
interface ProfileFormValues {
  name: string;
  phone_no: string;
}

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const [loading, setloading] = useState(false)
  const profile = user.profile;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirm, setconfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<ProfileFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: profile?.name || "",
      phone_no: profile?.phone_no || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phone_no: Yup.string()
        .matches(
          /^[0-9]*$/,
          "Phone must contain only numbers",
        )
        .min(10, "Phone must be of 10 digits")
        .max(10, "Phone must be of 10 digits")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      setSaving(true);
      setError(null);
      setSuccess(null);
      setloading(true);
      try {
        await handleupload(values);
      } catch (e: any) {
        const statuscode = e.response.status;
        if (statuscode === 404) {
                    ToastMessage(MessageType.Error,e.response.data.message);
        } else {
          ToastMessage(MessageType.Error,"Server Error try again later");
        }

        setImageFile(null);
        setPreviewImg(null);
      } finally {
        setSaving(false);
        setloading(false)
      }
    },
  });
  const handleupload = async (values: { name: string; phone_no: string }) => {
    const file = imageFile;
    let img_path = profile?.profile_image || "";
    if (file) {
      const formData = new FormData();
      formData.append("profileimage", file);
      const response = await axiosInstance.post("/upload", formData);
      img_path = response.data.data.imagePath;
      const hostedImage = img_path;
      setPreviewImg(hostedImage);
    }

    const data = {
      name: values.name,
      email: profile?.email,
      profile_image: img_path,
      phone_no: values.phone_no,
    };
    await axiosInstance.put("/profile", data);
    setSuccess("Profile updated successfully");
    dispatch(
      updateUser({
        name: values.name,
        email: profile?.email ?? "",
        profile_image: img_path,
        phone_no: values.phone_no,
      }),
    );
    setIsEditing(false);
  };

  const profileImg =
    previewImg ||
    (profile?.profile_image ? profile.profile_image : null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!IMAGE_MIMETYPE.includes(file.type)) {
                      ToastMessage(MessageType.Error,"Only JPG, JPEG and PNG images are allowed");
      return;
    }
    if (file.size > IMAGE_FILE_SIZE) {
                            ToastMessage(MessageType.Error,"File size must be less than 2MB");

      return;
    }
    setImageFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImg(null);
    setImageFile(null);
    setError(null);
    setSuccess(null);
    formik.resetForm();
  };

  const handleDeleteAccount = async () => {
      try {
        await axiosInstance.delete("/delete-user");

        dispatch(logout());
        
          ToastMessage(MessageType.Success,"Account deleted successfully");
        navigate("/",{ replace: true });
        // Optionally, you can also dispatch a logout action or redirect the user to the login page
      } catch (e: any) {
        const statuscode = e.response.status;
        
        if (statuscode === 404) {
          ToastMessage(MessageType.Error,e.response.data.message);
        } else if (statuscode === 400){
          ToastMessage(MessageType.Error,e.response.data.message);
        }
        else {
        ToastMessage(MessageType.Error,"Server Error try again later");
        }
      }
    
  };

  const openDeleteModal = () => {
    setconfirm(false);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setconfirm(false);
    setShowDeleteModal(false);
  };

  const confirmDeleteAccount = async () => {
    await handleDeleteAccount();
    setconfirm(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] px-6 py-10 md:px-16 lg:px-24 xl:px-32 relative">
      {loading && <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black/20 disabled:cursor-not-allowed backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
    </div>}
      {showDeleteModal && !confirm && (
        <CancelModal
          setconfirm={setconfirm}
          title="Delete account"
          message="Are you sure you want to delete your account? This will permanently remove your account and data."
          confirmText="Delete account"
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteAccount}
        />
      )}
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        {/* ── Header card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={profileImg ? profileImg : assets.user_profile}
              alt="Profile"
              className="rounded-full object-cover border-2 border-blue-200"
              style={{ width: 80, height: 80 }}
            />

            {/* Camera — only visible in edit mode */}
            {isEditing && (
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-500
                  border-2 border-white flex items-center justify-center
                  hover:bg-blue-600 transition-colors cursor-pointer"
                aria-label="Change photo"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Name + email + badge */}
          <div className="flex-1">
            <p className="text-xl font-medium text-gray-900">
              {profile?.name || "User"}
            </p>
            <p className="text-sm text-gray-500 mt-1">{profile?.email || ""}</p>
            <span
              className="inline-block mt-2 text-xs font-medium px-3 py-1
              rounded-full bg-green-50 text-green-700"
            >
              ✓ Verified
            </span>
          </div>
        </div>

        {/* ── Messages ── */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-3 rounded-xl">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* ── Account details card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-base font-medium text-gray-900">
              Account details
            </p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-500
                  px-4 py-1.5 border border-gray-200 rounded-lg
                  hover:bg-blue-50 transition-colors"
              >
                {/* Edit icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          {/* Fields */}
          <form
            onSubmit={formik.handleSubmit}
            className="px-6 py-6 flex flex-col gap-5"
          >
            {/* Name + Phone row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                  Full name
                </label>
                <input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  placeholder="Enter your name"
                  className={`text-sm px-4 py-2.5 rounded-xl border outline-none transition-all
                    ${
                      isEditing
                        ? "border-blue-400 bg-white text-gray-900 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-100 bg-gray-50 text-gray-500 cursor-default"
                    }`}
                />
                {(formik.touched.name || formik.submitCount > 0) &&
                  formik.errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.name}
                    </p>
                  )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                  Phone number
                </label>
                <input
                  name="phone_no"
                  value={formik.values.phone_no}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  placeholder="Not added yet"
                  className={`text-sm px-4 py-2.5 rounded-xl border outline-none transition-all
                    ${
                      isEditing
                        ? "border-blue-400 bg-white text-gray-900 focus:ring-2 focus:ring-blue-100"
                        : "border-gray-100 bg-gray-50 text-gray-500 cursor-default"
                    }`}
                />
                {(formik.touched.phone_no || formik.submitCount > 0) &&
                  formik.errors.phone_no && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.phone_no}
                    </p>
                  )}
              </div>
            </div>

            {/* Email — always disabled */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                Email address
              </label>
              <input
                value={profile?.email || ""}
                disabled
                className="text-sm px-4 py-2.5 rounded-xl border border-gray-100
                  bg-gray-50 text-gray-500 cursor-default outline-none"
              />
            </div>

            {/* Profile image upload — only in edit mode */}
            {isEditing && (
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                  Profile photo
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border border-dashed
                    border-blue-300 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  {/* Preview or placeholder */}
                  {previewImg ? (
                    <img
                      src={previewImg}
                      alt="preview"
                      className="w-10 h-10 rounded-full object-cover border border-blue-200"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200
                      flex items-center justify-center text-blue-400"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      {previewImg
                        ? "Photo selected — click to change"
                        : "Click to upload photo"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      JPG or PNG, max 2MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save / Cancel bar — only in edit mode */}
            {isEditing && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm px-5 py-2 rounded-xl border border-gray-200
                  text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="text-sm px-5 py-2 rounded-xl bg-blue-500 text-white
                  font-medium hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ── Delete account ── */}
        <div
          className="bg-white border border-red-100 rounded-2xl px-6 py-5
          flex items-center justify-between gap-4 flex-wrap"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">Delete account</p>
            <p className="text-xs text-gray-400 mt-1">
              Permanently removes all your data.
            </p>
          </div>
          <button
            className="text-sm px-5 py-2 rounded-xl border border-red-200
              text-red-500 hover:bg-red-50 transition-colors"
            type="button"
            onClick={openDeleteModal}
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
