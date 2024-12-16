import GradientBackground from "../../components/GradientBackground";
import { SiteHeader } from "./Navbar";
import { SearchSection } from "./SearchSection";
const Home = () => {
  return (
    <GradientBackground>
      <SiteHeader />
      <div className="flex flex-col items-center justify-center mt-[10%]">
        <SearchSection />
      </div>
    </GradientBackground>
  );
};

export default Home;
