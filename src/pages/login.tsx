import LoginBg from "../components/LoginBg";
import Card from "../components/Card";

const login = () => {
  return (
    <LoginBg>
      <div className="flex justify-center items-center  h-screen ">
        <Card />
      </div>
    </LoginBg>
  );
};

export default login;
