import { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import profilePlaceholder from "../../assets/profile_signup.svg";
import { uploadImage } from "../../Api/CommonApi";
import { Camera, Upload } from "lucide-react";
import Webcam from "react-webcam";
import { ImageUploadPopupProps } from "../../props/Props";

const ImageUploadPopup = ({
  setShowImageUploadPopup,
}: ImageUploadPopupProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleUpload = async (fileToUpload: File) => {
    try {
      setLoading(true);

      // Fetch user ID safely
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return false;
      }

      // Upload image
      const data = await uploadImage(userId, fileToUpload);
      console.log("Image uploaded successfully:", data);
      toast.success("Profile updated successfully");
      localStorage.setItem("image", data.imagePath);
      return true;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

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

  const startCamera = () => {
    setShowCamera(true);
  };

  const stopCamera = () => {
    setShowCamera(false);
  };

  const captureImage = async () => {
    if (!webcamRef.current) return;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        toast.error("Failed to capture image");
        return;
      }

      // Convert base64 to blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      // Create a File object
      const capturedFile = new File([blob], "captured-image.jpg", {
        type: "image/jpeg",
      });

      // Update state
      setFile(capturedFile);
      setImagePreview(imageSrc);
      stopCamera();

      // Upload the captured image
      const success = await handleUpload(capturedFile);
      if (success) {
        setShowImageUploadPopup(false);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      toast.error("Failed to capture image");
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

    const success = await handleUpload(file);
    if (success) {
      // Reset state only on success
      setFile(null);
      setImagePreview(null);
      setShowImageUploadPopup(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative w-[500px] bg-[#2C2C2E] rounded-3xl p-4">
        <button
          onClick={() => {
            stopCamera();
            setShowImageUploadPopup(false);
          }}
          className="absolute top-1 right-4 text-xl text-white hover:text-gray-400"
          aria-label="Close modal"
        >
          x
        </button>

        <div className="p-5 space-y-7 w-full max-w-[450px]">
          <div className="flex flex-col items-center gap-2">
            {showCamera ? (
              <div className="relative w-[400px] h-[300px] bg-black rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  mirrored={true}
                  videoConstraints={{
                    width: 400,
                    height: 300,
                    facingMode: "user",
                  }}
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <Button
                    onClick={captureImage}
                    className="bg-white text-black hover:bg-gray-200"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Capture"}
                  </Button>
                  <Button
                    onClick={stopCamera}
                    className="bg-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
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

                <div className="flex gap-4 mt-4">
                  <Button
                    onClick={startCamera}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Camera size={20} />
                    Take Photo
                  </Button>
                  <label
                    htmlFor="profile-upload"
                    className="flex items-center gap-2 cursor-pointer bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    <Upload size={20} />
                    Upload Photo
                  </label>
                </div>
              </>
            )}
          </div>

          {!showCamera && file && (
            <Button
              variant="default"
              className="w-full h-[49px] rounded-full text-white"
              style={{
                background: "linear-gradient(180deg, #ff7855 0%, #ff3500 100%)",
                transition: "opacity 0.3s",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Upload Image"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPopup;
