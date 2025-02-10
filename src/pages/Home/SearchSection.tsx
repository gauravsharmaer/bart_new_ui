import {
  MagnifyingGlass,
  Password,
  Desktop,
  Wrench,
  Printer,
  Shield,
} from "@phosphor-icons/react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useSelector, useDispatch } from "react-redux";
// import ChatUi from "../../components/ChatUi";
import { RootState } from "../../redux/store";
import { setInitialMessage } from "../../redux/chatSlice";
import { useState } from "react";
import NewChatUi from "../../components/NewChatUi";
import { useNavigate } from "react-router-dom";
import { askBart, getHistory, likeChat, unlikeChat, getUserChats, deleteChat, renameChat } from "../../Api/CommonApi";
export function SearchSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState<string>("");
  const { showChatUi, initialMessage } = useSelector(
    (state: RootState) => state.chat
  );



  const apiHandlers = {
    askBart: askBart,
    getHistory: getHistory,
    likeChat: likeChat,
    unlikeChat: unlikeChat,
    getUserChats: getUserChats,
    deleteChat: deleteChat,
    renameChat: renameChat,


  };

  const handleSearch = () => {
    if (inputMessage.length > 0) {
      dispatch(setInitialMessage(inputMessage));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTemplateClick = (template: string) => {
    dispatch(setInitialMessage(template));
  };

  return (
    <>
      {showChatUi ? (
        // <ChatUi
        //   initialMessage={
        //     initialMessage.length > 0 ? initialMessage : undefined
        //   }
          
        // />
        <NewChatUi initialMessage={initialMessage} apiHandlers={apiHandlers} />
      ) : (
        <div
          className="container max-w-4xl py-6 md:py-12"
          style={{ marginTop: "80px" }}
        >
          <h1
            className="text-center text-3xl font-passenger font-semibold tracking-tighter mb-8 text-[#202B3B] dark:text-gray-200"
            style={{ marginBottom: "25px" }}
          >
            Got questions or need help?
          </h1>
          <div className="relative flex justify-center">
            <Input
              type="search"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder=" Have any questions? Or choose a template below to get started"
              className="w-[75%] h-14 pl-4 pr-12 rounded-full py-3
               text-[#000000] dark:text-gray-200 font-graphik font-normal opacity-50 dark:opacity-70 
               dark:bg-[#2c2d32] dark:border-[#3a3b40] dark:placeholder-gray-400
               focus:outline-none focus:ring-1 focus:ring-[#E8E8E8] dark:focus:ring-[#3a3b40]"
              style={{
                border: "2px solid #E8E8E8",
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSearch}
              disabled={inputMessage.length === 0}
              className="absolute bg-[#EF613C] dark:bg-[#ff8851] dark:hover:bg-[#ff7a3d]
           p-6 rounded-full right-[13%] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground
           transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MagnifyingGlass className="h-5 w-5 rounded-full text-white" />
            </Button>
          </div>
          <div className="flex flex-nowrap gap-2 mt-6 justify-center w-full px-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] dark:bg-[#2c2d32] font-passenger font-normal text-[#171717] dark:text-gray-200 
              opacity-60 dark:opacity-90 border dark:border-[#3a3b40] hover:bg-gray-200 dark:hover:bg-[#3a3b40] 
              flex items-center gap-2 whitespace-nowrap transition-colors duration-200"
              onClick={() => handleTemplateClick("Hey bart reset my password")}
            >
              <Password weight="fill" className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              Password Management
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] dark:bg-[#2c2d32] font-passenger font-normal text-[#171717] dark:text-gray-200 
              opacity-60 dark:opacity-90 border dark:border-[#3a3b40] hover:bg-gray-200 dark:hover:bg-[#3a3b40] 
              flex items-center gap-2 whitespace-nowrap transition-colors duration-200"
              onClick={() =>
                handleTemplateClick("Hey bart I need a new equipment")
              }
            >
              <Desktop weight="fill" className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              Equipment Request
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] dark:bg-[#2c2d32] font-passenger font-normal text-[#171717] dark:text-gray-200 
              opacity-60 dark:opacity-90 border dark:border-[#3a3b40] hover:bg-gray-200 dark:hover:bg-[#3a3b40] 
              flex items-center gap-2 whitespace-nowrap transition-colors duration-200"
              onClick={() =>
                handleTemplateClick("Hey bart I need software support")
              }
            >
              <Wrench weight="fill" className="h-4 w-4 text-green-500 dark:text-green-400" />
              Software Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] dark:bg-[#2c2d32] font-passenger font-normal text-[#171717] dark:text-gray-200 
              opacity-60 dark:opacity-90 border dark:border-[#3a3b40] hover:bg-gray-200 dark:hover:bg-[#3a3b40] 
              flex items-center gap-2 whitespace-nowrap transition-colors duration-200"
              onClick={() =>
                handleTemplateClick("Hey bart I need to set-up my printer")
              }
            >
              <Printer weight="fill" className="h-4 w-4 text-red-500 dark:text-red-400" />
              Printer Set-Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] dark:bg-[#2c2d32] font-passenger font-normal text-[#171717] dark:text-gray-200 
              opacity-60 dark:opacity-90 border dark:border-[#3a3b40] hover:bg-gray-200 dark:hover:bg-[#3a3b40] 
              flex items-center gap-2 whitespace-nowrap transition-colors duration-200"
              onClick={() =>
                handleTemplateClick("Hey bart I need IT security help")
              }
            >
              <Shield weight="fill" className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
              IT Security
            </Button>
            <Button
              variant="default"
              onClick={() => navigate("/password")}
              size="sm"
              className="text-orange-500 dark:text-[#ff8851] hover:bg-transparent dark:hover:text-[#ff7a3d] bg-transparent whitespace-nowrap transition-colors duration-200"
            >
              All Templates
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
