import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Link, useLocation } from "react-router-dom";
import Notification from "./Notification";
import Profile from "./Profile";
import genie from "../../assets/Genie.svg";
import invite from "../../assets/invite.svg";
// import profileicon from "../../assets/profile.svg";
import notificationicon from "../../assets/notification-bell.svg";
import menubar from "../../assets/menu-bar.svg";
import { BackendBaseUrl } from "../../config";
import { getInitials } from "../../utils/NameInitials";
export function SiteHeader() {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  // const getInitials = (name: string): string => {
  //   if (!name) return "";
  //   return name
  //     .split(" ")
  //     .map((word) => word.charAt(0))
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 2);
  // };

  // Toggle notification sidebar
  const toggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
    setProfileOpen(false); // Close profile if notification opens
  };

  // Toggle profile sidebar
  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
    setNotificationOpen(false); // Close notification if profile opens
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
        <div className="flex items-center h-14 px-10">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8">
                <img src={genie} alt="Logo" className="h-8 w-8" />
              </div>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className={`relative flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-primary ${
                  location.pathname === "/"
                    ? "text-primary bg-gray-100"
                    : "text-muted-foreground"
                }`}
              >
                <span className="z-10">Home</span>
                {location.pathname === "/" && (
                  <div className="absolute inset-0 rounded-full bg-gray-100 pointer-events-none"></div>
                )}
              </Link>
              <Link
                to="/tickets"
                className={`relative flex items-center justify-center px-2 py-2 text-sm font-medium transition-colors rounded-full hover:text-primary ${
                  location.pathname === "/tickets"
                    ? "text-primary bg-gray-100"
                    : "text-muted-foreground"
                }`}
              >
                <span className="z-10">My tickets</span>
                {location.pathname === "/tickets" && (
                  <div className="absolute inset-0 rounded-full bg-gray-100 pointer-events-none"></div>
                )}
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="flex w-full max-w-2xl items-center border border-gray-200 rounded-full relative">
              <MagnifyingGlass
                size={20}
                className="absolute left-3 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder="Search chats, ticket id and more..."
                className="h-9 lg:w-[600px] rounded-full pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-[#fafafa]"
            >
              <img src={invite} alt="Invite" className="h-4 w-4" />
              Invite team-mate
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleNotification}
            >
              <img
                src={notificationicon}
                alt="Notifications"
                className="h-6 w-6"
              />
              <span className="absolute bottom-6 left-5 h-4 w-4"></span>
            </Button>
            <div className="flex items-center space-x-4">
              {/* <img
                src={
                  localStorage.getItem("image") != "undefined"
                    ? `${BackendBaseUrl}/${localStorage.getItem("image")}`
                    : profileicon
                }
                alt="Profile"
                className="h-10 w-10 rounded-full"
              /> */}
              {localStorage.getItem("image") &&
              localStorage.getItem("image") !== "undefined" ? (
                <img
                  src={`${BackendBaseUrl}/${localStorage.getItem("image")}`}
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#FF6F61] flex justify-center items-center text-xl text-white mr-3">
                  {getInitials(localStorage.getItem("name") || "")}
                </div>
              )}

              <Button variant="ghost" size="icon" onClick={toggleProfile}>
                <img src={menubar} alt="Menu" className="h-7 w-7" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div
        className={`fixed top-0 ${
          isNotificationOpen ? "right-0" : "-right-[367px]"
        } w-[367px] h-screen bg-white shadow-lg transition-right duration-300 ease-in-out z-[1000]`}
      >
        <Notification
          isOpen={isNotificationOpen}
          onClose={() => setNotificationOpen(false)}
        />
      </div>
      <div
        className={`fixed top-0 ${
          isProfileOpen ? "right-0" : "-right-[324px]"
        } w-[324px] h-screen bg-white shadow-lg transition-right duration-300 ease-in-out z-[1000]`}
      >
        <Profile isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
      </div>
    </>
  );
}

export default SiteHeader;
