import React, { useState } from "react";
import axios from "axios";
import { ImageUploadProps } from "../props/Props";
// interface ImageUploadProps {
//   onUploadSuccess?: (imageId: string) => void;
// }

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      setUploading(true);
      const response = await axios.post("/api/images/upload", {
        name: "uploaded-image",
        image: selectedImage,
        contentType: selectedImage.split(";")[0].split(":")[1],
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data.id);
      }

      // Clear the selected image after successful upload
      setSelectedImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Select Image
      </label>

      {selectedImage && (
        <div className="flex flex-col items-center gap-4">
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-xs max-h-64 object-contain"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
