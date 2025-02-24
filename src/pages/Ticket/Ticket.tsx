import { Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SiteHeader } from "../../components/Navbar";

import { useState } from "react";
import { CaretDown } from "phosphor-react";

import { TicketTable } from "./TicketTable";
import TicketCard from "./TicketCard";
import Grid from "../../assets/GridFour.svg"
import Cards from "../../assets/CardsThree.svg"
import DarkGrid from "../../assets/darkGrid.svg"
import DarkCards from "../../assets/darkCards.svg"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


const Tickets = () => {
  const [gridViewEnabled, setGridViewEnabled] = useState(true);
  const [printViewEnabled, setPrintViewEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#111111]">
      <SiteHeader />

      <main className="flex flex-col px-6 py-8">
        <div className="w-full max-w-none mx-auto space-y-6 ">
          {/* Header */}
          <div className="w-full max-w-none flex items-center justify-between h-[40px] bg-white dark:bg-[#111111] px-1 text-sm font-semibold rounded-md">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-[#f0f0f0]">My tickets</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
             
              <input
                type="text"
                placeholder="Search tickets"
                className="pl-10 pr-4 py-2 w-full sm:w-[340px] border border-gray-300 dark:border-[#2c2d32]  dark:bg-[#111111] dark:text-gray-200 
                dark:placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-[#3a3b40] transition-colors duration-200"
                style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: isDarkMode ? "#4f4f4f" : "#d1d5db" }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-8 border-b border-gray-200 dark:border-[#2c2d32] w-full">
              <button
                className={`px-1 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "all"
                    ? "border-b-2 border-[#523ec6] dark:border-[#ef613c] text-black dark:text-[#f0f0f0]"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All tickets
              </button>
              <button
                className={`px-1 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "unresolved"
                    ? "border-b-2 border-[#523ec6] dark:border-[#ef613c] text-black dark:text-[#f0f0f0]"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("unresolved")}
              >
                Ticket not resolved
              </button>
              <button
                className={`px-1 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "resolved"
                    ? "border-b-2 border-[#523ec6] dark:border-[#ef613c] text-black dark:text-[#f0f0f0]"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("resolved")}
              >
                Resolved Ticket
              </button>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-[#f0f0f0]">All tickets</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Apply Filters with Dropdown */}
              <div className="relative">
                <button className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-[#f0f0f0] 
                bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333333] rounded-lg shadow-sm 
                hover:bg-gray-200 dark:hover:bg-[#3a3b40] transition-colors duration-200">
                  Apply filters
                  <CaretDown size={16} className="ml-2 text-gray-700 dark:text-white" />
                </button>
              </div>

              {/* Icons Container */}
              <div className="flex items-center gap-2 border border-gray-200 dark:border-[#2c2d32] rounded-lg pt-1 pb-1 pl-1 pr-1 w-35  bg-gray-100 dark:bg-[#1e1e1e]">
                {/* Grid View Icon */}
              

              <Button
                  variant="outline"
                  size="default"
                  className={`text-sm transition-colors duration-200 ${
                    gridViewEnabled
                    ? "bg-white dark:bg-[#383838] text-black dark:text-gray-200 border-gray-300 dark:border-[#ffffff] dark:border-opacity-30 hover:bg-white dark:hover:bg-[#3a3b40]"
                    : "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#1e1e1e] border-none dark:border-[#2c2d32] hover:bg-gray-100 dark:hover:bg-[#2c2d32]"
                  }`}
                  onClick={() => {
                    setGridViewEnabled(true);
                    setPrintViewEnabled(false);
                  }}
                >
                  <img src={Grid} alt="Grid" className="w-4 h-4 dark:hidden" />
                  <img src={DarkGrid} alt="Grid" className="w-4 h-4 hidden dark:block" />

                </Button>

                {/* Print Icon */}
      


                <Button
                  variant="outline"
                  size="default"
                  className={`text-sm transition-colors duration-200 ${
                    printViewEnabled
                    ? "bg-white dark:bg-[#383838] text-black dark:text-gray-200 border-gray-300 dark:border-[#ffffff] dark:border-opacity-30 hover:bg-white dark:hover:bg-[#3a3b40]"
                      : "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#1e1e1e] border-none dark:border-[#2c2d32] hover:bg-gray-100 dark:hover:bg-[#2c2d32]"
                  }`}
                  onClick={() => {
                    setPrintViewEnabled(true);
                    setGridViewEnabled(false);
                  }}
                >
                  <img src={Cards} alt="Cards" className="w-4 h-4 dark:hidden" />
                  <img src={DarkCards} alt="Cards" className="w-4 h-4 hidden dark:block" />

                </Button>
              </div>
            </div>
          </div>

          {printViewEnabled ? (
             <TicketCard 
               type={activeTab as 'all' | 'resolved' | 'unresolved'} 
               data-type={activeTab}
             />
          ) : (
            <TicketTable 
              type={activeTab as 'all' | 'resolved' | 'unresolved'}
              data-type={activeTab}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Tickets;
