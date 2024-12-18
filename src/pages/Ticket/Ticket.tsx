import { Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SiteHeader } from "../Home/Navbar";
import { Table } from "./Table";
import { CaretDown } from "@phosphor-icons/react";

const Tickets = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Section */}
      <SiteHeader />

      <main className="flex flex-col px-6 py-8">
        <div className="w-full max-w-[1200px] mx-auto space-y-6">
          {/* Page Title & Search */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">My tickets</h1>
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tickets"
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>


          <div className="flex gap-8 border-b border-gray-200">
            <button className="text-sm font-medium border-b-2 border-purple-600 text-black px-2 py-2">
              All tickets
            </button>
            <button className="text-sm font-medium text-gray-500 px-2 py-2">
              Ticket not resolved
            </button>
            <button className="text-sm font-medium text-gray-500 px-2 py-2">
              Resolved Ticket
            </button>
          </div>

          {/* Filters & Controls */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">All tickets</span>
            <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-sm font-medium"
            >
              Apply filters
              <CaretDown size={16} weight="bold" />
            </Button>


          <Button
      variant="outline"
      size="sm"
      className="bg-white text-gray-700 border-r border-gray-200"
    >
          ⊞
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-100 text-gray-400"
        >
          🖨️
        </Button>
      </div>
    </div>

          {/* Table Component */}
          
          <Table />
        </div>
      </main>
    </div>
  );
};

export default Tickets;
