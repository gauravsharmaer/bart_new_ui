import SignUpCard from "./SignUpCard";
import bgSignup from "../../assets/bg_signup.svg";

const signup = () => {
  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${bgSignup})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <SignUpCard />
    </div>
  );
};

export default signup;