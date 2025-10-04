import { postAPI } from "./api.js";

// Function to get Cloudinary upload signature from backend
export const getUploadSignature = async () => {
  const response = await fetch("/api/upload/signature", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to get upload signature");
  }
  return response.json();
};

// Function to upload image file to Cloudinary using signature from backend
export const uploadImageToCloudinary = async (file) => {
  const { timestamp, signature, apiKey, cloudName, folder } = await getUploadSignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url;
};
