import { MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import ChatUi from "../../components/ChatUi";
export function SearchSection() {
  const [initialMessage, setInitialMessage] = useState("");
  const [ChatUiTrue, setChatUiTrue] = useState(false);
  const handleSearch = () => {
    setChatUiTrue(true);
  };
  return (
    <>
      {ChatUiTrue ? (
        <ChatUi initialMessage={initialMessage} />
      ) : (
        <div className="container max-w-4xl py-6 md:py-12">
          <h1 className="text-center text-3xl font-bold tracking-tighter mb-8 text-[#202B3B]">
            Got questions or need help?
          </h1>
          <div className="relative flex justify-center">
            <Input
              type="search"
              value={initialMessage}
              onChange={(e) => {
                setInitialMessage(e.target.value);
              }}
              placeholder="Have any questions? Or choose a template below to get started"
              className="w-[80%] h-12 pl-4 pr-12 rounded-full py-3 bg-[#FFFFFF] text-black"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSearch}
              className="absolute bg-[#EF613C]
           p-4 rounded-full right-[10.5%] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <MagnifyingGlass className="h-5 w-5   rounded-full text-white" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F199] opacity-60 border"
            >
              Password Management
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F199] opacity-60 border-2"
            >
              Equipment Request
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F199] opacity-60 border-2"
            >
              Software Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F199] opacity-60 border-2"
            >
              Printer Set-Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#F1F1F199] opacity-60 border-2"
            >
              IT Security
            </Button>
            <Button
              variant="default"
              size="sm"
              className="text-orange-500 hover:bg-transparent bg-transparent"
            >
              All Templets
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
