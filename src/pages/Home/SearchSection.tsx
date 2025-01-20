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
import ChatUi from "../../components/ChatUi";
import { RootState } from "../../redux/store";
import { setInitialMessage } from "../../redux/chatSlice";
import { useState } from "react";

export function SearchSection() {
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState<string>("");
  const { showChatUi, initialMessage } = useSelector(
    (state: RootState) => state.chat
  );

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
        <ChatUi
          initialMessage={
            initialMessage.length > 0 ? initialMessage : undefined
          }
        />
      ) : (
        <div
          className="container max-w-4xl py-6 md:py-12"
          style={{ marginTop: "80px" }}
        >
          <h1
            className="text-center text-3xl font-passenger font-semibold tracking-tighter mb-8 text-[#202B3B]"
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
               text-[#000000] font-graphik font-normal opacity-50"
              style={{
                border: "2px solid #E8E8E8",
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSearch}
              disabled={inputMessage.length === 0}
              className="absolute bg-[#EF613C]
           p-6 rounded-full right-[13%] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <MagnifyingGlass className="h-5 w-5 rounded-full text-white" />
            </Button>
          </div>
          <div className="flex flex-nowrap gap-2 mt-6 justify-center w-full px-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] font-passenger font-normal text-[#171717] opacity-60 border  flex items-center gap-2 whitespace-nowrap"
              onClick={() => handleTemplateClick("Password Management")}
            >
              <Password weight="fill" className="h-4 w-4 text-blue-500" />
              Password Management
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] font-passenger font-normal text-[#171717] opacity-60  border flex items-center gap-2 whitespace-nowrap"
              onClick={() => handleTemplateClick("Equipment Request")}
            >
              <Desktop weight="fill" className="h-4 w-4 text-purple-500" />
              Equipment Request
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] font-passenger font-normal text-[#171717] opacity-60 border flex items-center gap-2 whitespace-nowrap"
              onClick={() => handleTemplateClick("Software Support")}
            >
              <Wrench weight="fill" className="h-4 w-4 text-green-500" />
              Software Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] font-passenger font-normal text-[#171717] opacity-60 border flex items-center gap-2 whitespace-nowrap"
              onClick={() => handleTemplateClick("Printer Set-Up")}
            >
              <Printer weight="fill" className="h-4 w-4 text-red-500" />
              Printer Set-Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F1] font-passenger font-normal text-[#171717] opacity-60 border flex items-center gap-2 whitespace-nowrap"
              onClick={() => handleTemplateClick("IT Security")}
            >
              <Shield weight="fill" className="h-4 w-4 text-yellow-500" />
              IT Security
            </Button>
            <Button
              variant="default"
              size="sm"
              className="text-orange-500 hover:bg-transparent bg-transparent whitespace-nowrap"
            >
              All Templates
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
