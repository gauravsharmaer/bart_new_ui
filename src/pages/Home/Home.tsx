import { SiteHeader } from "../../components/Navbar";
import { SearchSection } from "./SearchSection";
import FacialConfirmationPopup from "./FacialConfirmationPopup";
import { useState, useEffect } from "react";
import VerifyAuthCapture from "./verifyAuthCapture";
import bgHome from "../../assets/bg_home.svg"; // Import your SVG
import ImageUploadPopup from "../../components/ui/ImageUploadPopup";

const Home = () => {
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showImageUploadPopup, setShowImageUploadPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isFaceVerified") === "false") {
      setShowConfirmationPopup(true);
    }

    if (localStorage.getItem("image") === "undefined") {
      setShowImageUploadPopup(true);
    }
  }, []);

  return (
    <div
      className="dark:bg-[#1a1b1e] transition-colors duration-200"
      style={{
        backgroundImage: `url(${bgHome})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh", // Ensures it covers the full viewport height
        width: "100%",
      }}
    >
      {showConfirmationPopup && (
        <FacialConfirmationPopup
          showConfirmationPopup={showConfirmationPopup}
          setShowPopup={setShowPopup}
          setShowConfirmationPopup={setShowConfirmationPopup}
        />
      )}

      {showImageUploadPopup && (
        <ImageUploadPopup setShowImageUploadPopup={setShowImageUploadPopup} />
      )}
      <SiteHeader />
      <div className="flex flex-col items-center justify-center mt-[1%]">
        <SearchSection />
      </div>
      {showPopup &&
        localStorage.getItem("isFaceVerified") === "false" &&
        !showConfirmationPopup && (
          <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="relative w-[500px] bg-white dark:bg-[#2c2d32] rounded-3xl p-4 shadow-lg dark:shadow-[#1a1b1e]">
              {" "}
              {/* Added background and rounded corners */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-1 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                aria-label="Close modal"
              >
                x
              </button>
              <div className="rounded-lg p-6">
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
