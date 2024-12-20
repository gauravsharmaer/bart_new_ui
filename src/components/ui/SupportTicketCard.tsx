import Image from "../../assets/Genie.svg";
import { History } from 'lucide-react';
const SupportTicket=() => { 
  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-600">
          Jul 19, 06:30PM
          <span className="mx-0.5 text-gray-400">•</span>
          <span className="text-red-500 font-medium">Urgent</span>
        </div>
        <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
          <History className="w-5 h-5 text-white" />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">Floyd Miles | Password Recovery</h2>

      <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Ticket No</span>
          <span className="text-sm font-medium">#65434334</span>
        </div>

        <div className="h-px bg-gray-100 -mx-4"></div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Assigned to</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image 
                src="/placeholder.svg?height=24&width=24" 
                alt="Avatar"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium">Darlene Robertson</span>
          </div>
        </div>

        <div className="h-px bg-gray-100 -mx-4"></div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Est. Solution Time</span>
          <span className="text-sm font-medium">{'< 3Days'}</span>
        </div>
      </div>
    </div>
  );
};

export default SupportTicket;

