import { Bell, List, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Envelope } from "@phosphor-icons/react";
import bartLogo from "../../assets/bartLogo.svg";
import { Link } from "react-router-dom";
import genie from "../../assets/genie.svg";
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center h-14 px-10">
        <div className="flex items-center space-x-6 ">
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

        <div className="flex flex-1 items-center justify-center px-4 ">
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} weight="fill" />
            <span
              className="absolute  bottom-6 left-5 h-4 w-4
             rounded-full bg-red-500 text-[10px] font-medium
              text-white flex items-center justify-center"
            >
              2
            </span>
          </Button>
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-6 w-6">
              <img src={genie} alt="Logo" className="h-full w-full" />
            </div>
          </Link>

          <Button variant="ghost" size="icon" className="">
            <List size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
