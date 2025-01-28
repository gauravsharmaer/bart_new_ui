import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { AuthBackground } from "../../components/ui/authBackground";
// import VideoCard from "../../components/videoCard";
// import { handleOneloginAuth } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { handleOneloginAuth } from "../../redux/authSlice";
import { Spinner } from "@phosphor-icons/react";
import { CallbackApiService } from "./api";
// export interface CallbackInterface {
//   _id: string;
//   one_login_id: string;
//   email: string;
//   name: string;
//   faceDescriptor: [];
//   is_facial_verified: boolean;
// }

const OneLoginCallBack = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Get parameters from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code"); // Authentication code from OneLogin
      const state = params.get("state"); // State parameter for security
      console.log("state", state);
      // 2. Verify state (security check)
      // const savedState = sessionStorage.getItem("auth_state");
      if (!code) {
        // toast.error("Authentication failed");
        navigate("/login");
        return;
      }

      setLoading(true);

      try {
        // 3. Exchange code for tokens
        const response = await CallbackApiService.postCallback(code);

        if (!response) {
          throw new Error("Authentication failed");
        }

        // 5. Store user data
        localStorage.setItem("email", response.email);
        localStorage.setItem("user_id", response._id);
        localStorage.setItem("name", response.name);
        localStorage.setItem(
          "isFaceVerified",
          response.is_facial_verified.toString()
        );
        localStorage.setItem("image", response.imagePath);

        // 6. Clean up
        sessionStorage.removeItem("auth_state");

        // 7. Notify and redirect
        toast.success("Successfully logged in");
        dispatch(handleOneloginAuth(true));
        navigate("/"); // or your dashboard route
        setLoading(false);
      } catch (error) {
        // 8. Handle errors
        console.error("Authentication error:", error);
        // toast.error("Authentication failed");
        navigate("/login");
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  // 9. Show loading state
  return (
    <div className="grid grid-cols-2 gap-x-1">
      <div className="flex justify-center items-center h-screen"></div>

      <div className="flex justify-center items-center h-screen">
        {loading ? (
          <div className="text-purple-500 flex  items-center">
            <div className="animate-spin text-4xl">
              <Spinner />
            </div>
            <div className="">Authenticating...</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OneLoginCallBack;
