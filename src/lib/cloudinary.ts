import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "injaxhrz",
  api_key: "333983341487416",
  api_secret: "aNRmizjvQJDK3JwLDvVVxUKD75k",
});

export async function uploadImage(base64: string): Promise<string> {
  const result = await cloudinary.uploader.upload(base64, {
    folder: "portfolio",
  });
  return result.secure_url;
}

export async function deleteImage(url: string) {
  const publicId = url.split("/").slice(-2).join("/").replace(/\.[^/.]+$/, "");
  await cloudinary.uploader.destroy(publicId);
}
