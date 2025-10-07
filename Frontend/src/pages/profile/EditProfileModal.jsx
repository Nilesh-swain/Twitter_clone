import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../../utils/api";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUpload";

const EditProfileModal = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
    profileImg: null,
    coverImg: null,
  });
  const [uploadingImg, setUploadingImg] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: (data) => userAPI.updateUser(data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      document.getElementById("edit_profile_modal").close();
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImgChange = async (e, state) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingImg(true);
      try {
        const url = await uploadImageToCloudinary(file);
        setFormData({ ...formData, [state]: url });
        toast.success(`${state} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${state}`);
        console.error(error);
      } finally {
        setUploadingImg(false);
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const data = {
                fullname: formData.fullName || undefined,
                username: formData.username || undefined,
                email: formData.email || undefined,
                bio: formData.bio || undefined,
                link: formData.link || undefined,
                currentPassword: formData.currentPassword || undefined,
                newPassword: formData.newPassword || undefined,
                profileImg: formData.profileImg || undefined,
                coverImg: formData.coverImg || undefined,
              };
              updateUser(data);
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <div className="flex flex-wrap gap-2">
              <input
                type="file"
                accept="image/*"
                className="flex-1 file-input file-input-bordered file-input-md w-full"
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              <input
                type="file"
                accept="image/*"
                className="flex-1 file-input file-input-bordered file-input-md w-full"
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
            </div>
            <button className="btn btn-primary rounded-full btn-sm text-white" disabled={isPending || uploadingImg}>
              {isPending || uploadingImg ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
