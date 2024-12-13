// Table.tsx
import React from 'react';
import genie from "../../assets/genie.svg";

interface TicketData {
  name: string;
  ticketNo: string;
  dateTime: string;
  assignedTo: string;
  status: 'Urgent' | 'Normal';
  updateStatus: 'See update' | 'Resolved';
}

interface TableProps {
  data?: TicketData[];
}

export const Table: React.FC<TableProps> = ({ data }) => {
  // Use dummy data if no data is provided
  const tableData = data || Array(6).fill({
    name: 'Password Recovery',
    ticketNo: '#654345',
    dateTime: '24 July 2023 | 10:10 AM',
    assignedTo: 'Darlene Robertson',
    status: 'Urgent',
    updateStatus: 'See update'
  });

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-sm text-gray-600">
            <th className="px-6 py-3 text-left font-medium">Name</th>
            <th className="px-6 py-3 text-left font-medium">Ticket no</th>
            <th className="px-6 py-3 text-left font-medium">Date and time</th>
            <th className="px-6 py-3 text-left font-medium">Assigned to</th>
            <th className="px-6 py-3 text-left font-medium">Status</th>
            <th className="px-6 py-3 text-left font-medium">Updates</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tableData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">{row.name}</td>
              <td className="px-6 py-4">
                <span className="text-purple-600 text-sm">{row.ticketNo}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {row.dateTime}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={genie} 
                    alt="Genie logo" 
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600">{row.assignedTo}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-red-500 font-medium">{row.status}</span>
              </td>
              <td className="px-6 py-4">
                {idx % 2 === 0 ? (
                  <span className="text-orange-500 text-sm cursor-pointer">
                    See update
                  </span>
                ) : (
                  <span className="text-green-600 text-sm">
                    Resolved
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};