import { CLOUDINARY } from "../constants";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY.UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY.UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return data.secure_url;
}
