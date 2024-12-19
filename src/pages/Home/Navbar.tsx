import { useState } from "react";
import { Bell, List, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Envelope } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Notification from "./Notification";
import Profile from "./Profile"; // Import Profile Component
import genie from "../../assets/genie.svg";

export function SiteHeader() {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center h-14 px-10">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-6 w-6">
                <img src={genie} alt="Logo" className="h-full w-full" />
              </div>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/tickets"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                My tickets
              </Link>
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-center px-4">
            <div className="flex w-full max-w-2xl items-center relative">
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
              className="flex items-center gap-2"
            >
              <Envelope size={16} />
              Invite team-mate
            </Button>
            {/* Notification Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleNotification}
            >
              <Bell size={20} weight="fill" />
              <span
                className="absolute bottom-6 left-5 h-4 w-4
                 rounded-full bg-red-500 text-[10px] font-medium
                 text-white flex items-center justify-center"
              >
                2
              </span>
            </Button>

            {/* Three Bars Button for Profile */}
            <Button variant="ghost" size="icon" onClick={toggleProfile}>
              <List size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Notification Component */}
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

      {/* Profile Component */}
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
