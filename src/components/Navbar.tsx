import { useState, useCallback, useEffect, useRef } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import DocIcon from "../assets/document.svg";
import { Input } from "./ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Notification from "../pages/Home/Notification";
import Profile from "../pages/Home/Profile";
import genie from "../assets/Genie.svg";
import notificationicon from "../assets/notification-bell.svg";

import menubar from "../assets/menu-bar.svg";
import { BackendBaseUrl } from "../config";
import { getInitials } from "../utils/NameInitials";
import { useDispatch } from "react-redux";

import {
  resetChat,
  startNewChat,
  setSelectedChatId,
} from "../redux/chatSlice";
import { searchChatHistory } from "../Api/CommonApi";
import { chatHistory } from "../Interface/Interface";

export function SiteHeader() {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<chatHistory[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const initialFocusRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = async (query: string) => {
    try {
      setIsSearching(true);
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const results = await searchChatHistory(userId, query || undefined);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]); // Clear results on error
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 1000);

      return () => clearTimeout(timeoutId);
    },
    [] 
  );

  // Effect to handle debounced search
  useEffect(() => {
    const cleanup = debouncedSearch(searchQuery);
    return cleanup;
  }, [searchQuery, debouncedSearch]);

  const handleInputFocus = async () => {
    setShowSuggestions(true);
    if (!initialFocusRef.current) {
      initialFocusRef.current = true;
      await handleSearch("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSuggestionClick = (chatId: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    dispatch(setSelectedChatId(chatId));
    // navigate(`/chat/${chatId}`);
  };


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
      <header className="sticky top-0 z-50 w-full border-b border-[#DDE0E4] dark:border-[#2c2d32] bg-background/95 dark:bg-[#1a1b1e] backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-[#1a1b1e]/60">
        <div className="flex items-center h-14 px-10">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8">
                <img src={genie} alt="Logo" className="h-8 w-8 dark:opacity-90" />
              </div>
            </Link>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => {
                  navigate("/");
                  dispatch(resetChat());
                }}
                className={`relative flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-primary ${
                  location.pathname === "/"
                    ? "text-primary bg-[#F3F5F9] dark:bg-[#2c2d32]"
                    : "text-muted-foreground dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <span className="z-10 font-passenger font-medium text-[#000000] dark:text-gray-200">
                  Home
                </span>
                {location.pathname === "/" && (
                  <div className="absolute inset-0 rounded-full bg-[#F3F5F9] dark:bg-[#2c2d32] pointer-events-none"></div>
                )}
              </button>
              <button
                onClick={() => {
                  navigate("/");
                  dispatch(startNewChat());
                }}
                className={`relative flex items-center justify-center px-2 py-2 text-sm font-medium transition-colors rounded-full hover:text-primary ${
                  location.pathname === "/new-chat"
                    ? "text-primary bg-[#F3F5F9] dark:bg-[#2c2d32]"
                    : "text-muted-foreground dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <span className="z-10 font-passenger font-medium text-[#000000] dark:text-gray-200">
                  New Chat
                </span>
              </button>
              <Link
                to="/tickets"
                className={`relative flex items-center justify-center px-2 py-2 text-sm font-medium transition-colors rounded-full hover:text-primary ${
                  location.pathname === "/tickets"
                    ? "text-primary bg-[#F3F5F9] dark:bg-[#2c2d32]"
                    : "text-muted-foreground dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <span className="z-10 font-passenger font-medium text-[#000000] dark:text-gray-200">
                  My tickets
                </span>
                {location.pathname === "/tickets" && (
                  <div className="absolute inset-0 rounded-full bg-[#F3F5F9] dark:bg-[#2c2d32] pointer-events-none"></div>
                )}
              </Link>
            </nav>
          </div>
         

            <div className="flex flex-1 items-center justify-center px-4">
                  {location.pathname !== "/password" && (
              <div className="flex w-full max-w-2xl items-center border border-gray-200 dark:bg-[#1a1b1e] dark:border-[#2c2d32] rounded-full relative">
                <MagnifyingGlass
                size={20}
                className="absolute left-3 text-muted-foreground text-[#8F9099] dark:text-gray-400"
              />
              <Input
                type="search"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="Search chats, ticket id and more..."
                className="h-9 lg:w-[600px] rounded-full pl-10 font-passenger font-normal text-[#606775]  dark:text-gray-200 dark:placeholder-gray-400 dark:border-none focus:outline-none focus:ring-1 focus:ring-[#3a3b40] dark:focus:ring-[#3a3b40]"
              />
              {showSuggestions && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-[#1a1b1e] rounded-lg shadow-lg border border-gray-200 dark:border-[#2c2d32] max-h-[300px] overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-200"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleSuggestionClick(result.id)}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2c2d32] cursor-pointer dark:text-gray-200"
                      >
                        <p className="text-sm font-medium">{result.name}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
              )}
          </div>

          <div className="flex items-center space-x-4">
       
<Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 border border-[#EDEDED] bg-[#FAFAFA] font-passenger font-medium text-[#33343C] ${
                location.pathname === "/chat-with-pdf" ? "border-[#EF613C] bg-[#EF613C1A]" : ""
              }`}
              onClick={() => navigate("/chat-with-pdf")}
            >
              <img src={DocIcon} alt="Document Icon" className="h-4 w-4" /> {/* Use the imported SVG */}
              Chat with Docs
            </Button>



            <Button
              variant="ghost"
              size="icon"
              className="relative dark:hover:bg-[#2c2d32] transition-colors duration-200"
              onClick={toggleNotification}
            >
              <img
                src={notificationicon}
                alt="Notifications"
                className="h-6 w-6 dark:opacity-80"
              />
              <span className="absolute bottom-6 left-5 h-4 w-4"></span>
            </Button>
            <div className="flex items-center space-x-4">
        
              {localStorage.getItem("image") &&
              localStorage.getItem("image") !== "undefined" ? (
                <img
                  src={`${BackendBaseUrl}/${localStorage.getItem("image")}`}
                  alt="Profile"
                  className="h-10 w-10 rounded-full dark:opacity-90"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#FF6F61] flex justify-center items-center text-xl text-white mr-3">
                  {getInitials(localStorage.getItem("name") || "")}
                </div>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleProfile}
                className="dark:hover:bg-[#2c2d32] transition-colors duration-200"
              >
                <img src={menubar} alt="Menu" className="h-7 w-7 dark:opacity-80" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div
        className={`fixed top-0 ${
          isNotificationOpen ? "right-0" : "-right-[367px]"
        } w-[367px] h-screen bg-white dark:bg-[#1a1b1e] shadow-lg transition-right duration-300 ease-in-out z-[1000]`}
      >
        <Notification
          isOpen={isNotificationOpen}
          onClose={() => setNotificationOpen(false)}
        />
      </div>
      <div
        className={`fixed top-0 ${
          isProfileOpen ? "right-0" : "-right-[324px]"
        } w-[324px] h-screen bg-white dark:bg-[#1a1b1e] shadow-lg transition-right duration-300 ease-in-out z-[1000]`}
      >
        <Profile isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
      </div>
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        ></div>
      )}
    </>
  );
}

export default SiteHeader;
