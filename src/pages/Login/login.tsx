import GradientBackground from "../../components/GradientBackground";
import LoginCard from "./LoginCard";

const Login = () => {
  return (
    <GradientBackground>
      <div className="flex justify-center items-center h-screen">
        <LoginCard />
      </div>
    </GradientBackground>
  );
};

export default Login;
