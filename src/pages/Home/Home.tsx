import { SiteHeader } from "./Navbar";
import { SearchSection } from "./SearchSection";
import FacialConfirmationPopup from "./FacialConfirmationPopup";
import { useState, useEffect } from "react";
import VerifyAuthCapture from "./verifyAuthCapture";
import bgHome from "../../assets/bg_home.svg"; // Import your SVG

const Home = () => {
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isFaceVerified") === "false") {
      setShowConfirmationPopup(true);
    }
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${bgHome})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh", // Ensures it covers the full viewport height
        width:"100%",
      }}
    >
      {showConfirmationPopup && (
        <FacialConfirmationPopup
          showConfirmationPopup={showConfirmationPopup}
          setShowPopup={setShowPopup}
          setShowConfirmationPopup={setShowConfirmationPopup}
        />
      )}
      <SiteHeader />
      <div className="flex flex-col items-center justify-center mt-[1%]">
        <SearchSection />
      </div>
      {showPopup &&
        localStorage.getItem("isFaceVerified") === "false" &&
        !showConfirmationPopup && (
          <div className="fixed inset-0 bg-black/70  flex items-center justify-center z-50">
            <div className="relative w-[500px] bg-[#2C2C2E] rounded-3xl p-4">
              {" "}
              {/* Added background and rounded corners */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-1 right-4 text-xl text-white hover:text-gray-400"
                aria-label="Close modal"
              >
                x
              </button>
              <div className="bg-[#2C2C2E] rounded-lg p-6">
                <div className="flex flex-col items-center">
                  {/* <h2 className="text-white/90 text-2xl font-normal mb-3">
          Verify Your Authentication
        </h2>
        <p className="text-white/70 text-base mb-6">
          Please complete the verification process to continue
        </p> */}
                  <VerifyAuthCapture
                    onVerificationComplete={() => {
                      setShowPopup(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Home;
