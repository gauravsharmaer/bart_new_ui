import GradientBackground from "../../components/GradientBackground";
import SignUpCard from "./SignUpCard";

const signup = () => {
  return (
    <GradientBackground>
      <div className="flex justify-center items-center h-screen">
        <SignUpCard />
      </div>
    </GradientBackground>
  );
};

export default signup;
