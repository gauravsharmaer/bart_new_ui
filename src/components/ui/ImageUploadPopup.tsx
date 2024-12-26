import { useState } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
// import bartLogo from "../../assets/bartLogo.svg";
import profilePlaceholder from "../../assets/profile_signup.svg";
// import bgImage from "../../assets/bg_signup.svg";
import { uploadImage } from "../../Api/CommonApi";

export type ImageUploadPopupProps = {
  setShowImageUploadPopup: (value: boolean) => void;
};

const ImageUploadPopup = ({
  setShowImageUploadPopup,
}: ImageUploadPopupProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate File
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    // Optional: Validate file type and size (example: max 2MB, jpg/png only)
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG and PNG images are allowed");
      return;
    }

    try {
      setLoading(true);

      // Fetch user ID safely
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      // Upload image
      const data = await uploadImage(userId, file);
      console.log("Image uploaded successfully:", data);
      toast.success("Profile updated successfully");
      localStorage.setItem("image", data.imagePath);
      // Reset state only on success
      setFile(null);
      setImagePreview(null);
      setShowImageUploadPopup(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative w-[500px] bg-[#2C2C2E] rounded-3xl p-4">
        <button
          onClick={() => setShowImageUploadPopup(false)}
          className="absolute top-1 right-4 text-xl text-white hover:text-gray-400"
          aria-label="Close modal"
        >
          x
        </button>

        <div className="p-5 space-y-7 w-full max-w-[450px]">
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              onDrop={handleDrop}
              className="w-32 h-32 rounded-full cursor-pointer overflow-hidden"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={profilePlaceholder}
                  alt="Profile Placeholder"
                  className="w-full h-full object-cover hover:opacity-75 transition-opacity"
                />
              )}
            </label>
          </div>

          <Button
            variant="default"
            className="w-full h-[49px] rounded-full text-white"
            style={{
              background: "linear-gradient(180deg, #ff7855 0%, #ff3500 100%)",
              transition: "opacity 0.3s",
            }}
            onClick={handleSubmit}
            disabled={!file}
          >
            {loading ? "Processing..." : "Upload Image"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPopup;
