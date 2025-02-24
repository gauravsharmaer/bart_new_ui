import GradientBackground from "../../components/GradientBackground";
import LoginCard from "./LoginCard";

const Login = () => {
  return (
    <GradientBackground data-testid="gradient-background">
      <div className="flex justify-center items-center h-screen">
        <LoginCard data-testid="login-card" />
      </div>
    </GradientBackground>
  );
};

export default Login;
