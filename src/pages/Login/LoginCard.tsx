import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import oneLogin from "../../assets/oneLogin.png";
// import user from "../../assets/user.png";
// import { CaretDown } from "@phosphor-icons/react";
import bartLogo from "../../assets/bartLogo.svg";
import CardBackground from "../../components/CardBackground";
import { initiateOneLogin } from "../../utils/OneLoginAuth";
import { LoginApiService } from "./api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { currentProfile } from "../../redux/authSlice";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await LoginApiService.postLogin(email, password);
      toast.success(response.message);
      localStorage.setItem("email", response.email);
      localStorage.setItem("user_id", response.user_id);
      localStorage.setItem("name", response.name);
      localStorage.setItem(
        "isFaceVerified",
        response.isFaceVerified.toString()
      );
      dispatch(currentProfile());
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during login"
      );
    }
  };
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[450px] mx-auto">
      {/* Logo and Header */}
      <div className="flex flex-col items-center gap-2">
        <img src={bartLogo} alt="Bart Logo" className="w-15 h-15" />
        <div className="text-[#202B3B] text-xl font-medium">
          Login to your account
        </div>
      </div>

      <CardBackground>
        <div className="p-5 space-y-7 w-full max-w-[450px]">
          {/* Header Section */}
          <div className="space-y-7 ">
            <div className="space-y-7 ">
              <div
                className="relative h-[42px] bg-[#202B3B] rounded-[3.5px] border border-[#E7E7E7]/40 cursor-pointer"
                onClick={() => {
                  initiateOneLogin();
                }}
              >
                <div className="text-white text-[20px] font-normal pt-1">
                  Login with OneLogin
                </div>
                <div
                  className="absolute right-[7px] top-[7px] w-7 h-7
                 bg-white rounded-[2.8px] flex items-center justify-center"
                >
                  <img
                    src={oneLogin}
                    alt="One Login"
                    width={19}
                    height={19}
                    className="object-contain"
                  />
                </div>

                {/* <div
                  className="flex items-center gap-3 pt-1 pl-2"
                  onClick={() => {
                    initiateOneLogin();
                  }}
                >
                  <img
                    src={user}
                    alt="User"
                    width={13}
                    height={17}
                    className="w-[30px] h-[30px]"
                  />
                  <div className="flex flex-col">
                    <div className="text-white text-[8.7px] font-medium">
                      Continue as John Doe
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="text-white/70 text-xs">
                        johndoe@onelogin.com
                      </div>
                      <CaretDown size={16} className="text-white/70" />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-[100px] bg-[#000000] opacity-10"></div>
              <div className="text-[#202B3B] text-xs font-medium">or</div>
              <div className="h-[1px] w-[100px] bg-[#000000] opacity-10"></div>
            </div>

            {/* Form Section */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="relative h-[63px] flex flex-col gap-2">
                  <div className="text-[#202B3B] text-xs font-medium pl-2">
                    Email
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className=" rounded-full"
                  />
                </div>

                <div className="relative h-[63px] flex flex-col gap-2">
                  <div className="text-[#202B3B] text-xs font-medium pl-2">
                    Password
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-full"
                  />
                </div>
              </div>

              <Button
                variant="default"
                onClick={() => {
                  handleLogin(email, password);
                }}
                className="w-full h-[49px] rounded-full text-white bg-gradient-to-b from-[#FE7855] to-[#FF0000] hover:opacity-90 transition-opacity"
              >
                Continue
              </Button>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex flex-col items-center gap-7 w-[311px] mx-auto">
            <div className="flex items-center gap-0.5 opacity-70">
              <span className="text-[#202B3B] text-sm">
                Don't have an account?
              </span>
              <span className="text-[#FF3E0C] text-sm font-medium tracking-[0.14px]">
                <Link to="/signup">Sign Up</Link>
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 text-center opacity-70">
              <p className="text-[10.4px] leading-[12.5px]">
                <span className="text-[#202B3B]">
                  Having trouble logging in?{" "}
                </span>
                <span className="text-[#FF5600] font-medium">Click here</span>
                <span className="text-[#202B3B]">
                  {" "}
                  to set up a new password.
                </span>
              </p>

              <p className="text-[10.4px] leading-[12.5px]">
                <span className="text-[#202B3B]">If you need help </span>
                <span className="text-[#EF613C] font-medium">
                  contact support.
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardBackground>
    </div>
  );
}
