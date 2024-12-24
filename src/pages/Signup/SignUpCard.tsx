import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import bartLogo from "../../assets/bartLogo.svg";
import { toast } from "react-toastify";
import profileSignup from "../../assets/profile_signup.svg";

const Card = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
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
    if (!file || !firstName || !lastName) {
      toast.error("Please fill in all fields and select an image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `http://localhost:4000/api/users/upload-user-image?userId=674eaffe7cbb08e51f7adada`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Image uploaded successfully:", data);
      toast.success("Profile updated successfully");

      // Clear the form after successful upload
      setFile(null);
      setImagePreview(null);
      setFirstName("");
      setLastName("");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[450px] mx-auto">
      {/* Logo and Header */}
      <div className="flex flex-col items-center gap-8">
        <img src={bartLogo} alt="Bart Logo" className="w-16 h-16" />
        <div className="text-[#202B3B] text-[24px] font-medium">
          Upload Profile Photo
        </div>
      </div>

      {/* Card Background */}
      <div className="p-5 space-y-7 w-full max-w-[450px]">
        {/* Header Section */}
        <div className="space-y-7">
          {/* Drag/Select a photo */}
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
              src={profileSignup}
              alt="Profile Signup"
              className="w-32 h-32 rounded-full"
            />
             )}
             </label>
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <div className="space-y-4 mb-4">
              <div className="relative h-[63px] flex flex-col gap-2">
                <div className="text-[#202B3B] text-xs font-medium pl-4">
                  First Name
                </div>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-full w-100 h-100"
                />
              </div>

              <div className="relative h-[63px] flex flex-col gap-2 ">
                <div className="text-[#202B3B] text-xs font-medium pl-4">
                  Last Name
                </div>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-full w-100 h-100"
                />
              </div>
            </div>

            <Button
                variant="default"
                className="w-full h-[49px] rounded-full text-white bg-gradient-to-b from-[#FE7855] to-[#FF0000] 
                  hover:opacity-90 transition-opacity "
                onClick={handleSubmit}
                disabled={!file || !firstName || !lastName}
              >
                {loading ? "Processing..." : "I'm Ready"}
              </Button>

          </div>
        </div>
        {/* Footer Section */}
        <div className="flex flex-col items-center gap-7 w-[311px] mx-auto"></div>
      </div>
    </div>
  );
};

export default Card;