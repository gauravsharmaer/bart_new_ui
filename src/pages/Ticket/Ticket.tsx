// Tickets.tsx
import { Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SiteHeader } from "../Home/Navbar";
import { Table } from "./Table";
import { useState } from "react";
import { CaretDown } from "phosphor-react";

const Tickets = () => {
  const [gridViewEnabled, setGridViewEnabled] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex flex-col px-6 py-8">
        <div className="w-full max-w-[1096px] mx-auto space-y-6">
          {/* Header */}
          <div className="w-full max-w-[1096px] flex items-center justify-between h-[40px] bg-white px-1 text-sm font-semibold rounded-md">
            <h1 className="text-xl font-semibold">My tickets</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tickets"
                className="pl-10 pr-4 py-2 w-full sm:w-[280px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-8 border-b border-gray-200 w-full sm:w-auto">
              <button className="px-1 py-2 text-sm font-medium border-b-2 border-purple-600 text-black">
                All tickets
              </button>
              <button className="px-1 py-2 text-sm font-medium text-gray-600">
                Ticket not resolved
              </button>
              <button className="px-1 py-2 text-sm font-medium text-gray-600">
                Resolved Ticket
              </button>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">All tickets</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Apply Filters with Dropdown */}
              <div className="relative">
              <button className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200">
                Apply filters
                <CaretDown size={16} className="ml-2 text-gray-700" />
              </button>
              </div>

              {/* Icons Container */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 bg-gray-100">
                {/* Grid View Icon */}
                <Button
                  variant="outline"
                  size="sm"
                  className={`text-sm ${
                    gridViewEnabled
                      ? "bg-white text-black border-gray-300"
                      : "text-gray-600"
                  }`}
                  onClick={() => setGridViewEnabled(!gridViewEnabled)}
                >
                  <span className="sr-only">Grid view</span>⊞
                </Button>

                {/* Print Icon */}
                <Button
                  // variant="outline"
                  size="sm"
                  className="text-sm text-gray-400 bg-gray-100 hover:bg-gray-100 hover:text-gray-400 focus:ring-0"
                >
                  <span className="sr-only">Print</span>🖨️
                </Button>
              </div>
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