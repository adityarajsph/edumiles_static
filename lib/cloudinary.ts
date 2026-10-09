/**
 * lib/cloudinary.ts
 * Server-side Cloudinary upload helper.
 * Only used in the admin API upload route.
 */

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload a file buffer or base64 data URL to Cloudinary.
 * @param data  - base64 string, Buffer, or a public URL to fetch
 * @param folder - Cloudinary folder path (e.g. "edumiles/packages")
 */
export async function uploadToCloudinary(
  data: string,
  folder = "edumiles/uploads"
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(data, {
    folder,
    resource_type: "image",
    // Limit size via eager transformations
    eager: [{ width: 1600, crop: "limit" }],
    eager_async: false,
  });

  return {
    url:      result.secure_url,
    publicId: result.public_id,
    width:    result.width,
    height:   result.height,
    format:   result.format,
  };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
