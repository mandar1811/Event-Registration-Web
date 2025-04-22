import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const RegistrationTabDash = () => {
  const [registrations, setRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const mockRegistrations = [
      { id: 1, user: "Alice Johnson", event: "Annual Tech Conference" },
      { id: 2, user: "Bob Smith", event: "Networking Mixer" },
      { id: 3, user: "Carol Lee", event: "Leadership Workshop" },
      { id: 4, user: "David Kim", event: "Tech Conference" },
      { id: 5, user: "Eve Thomas", event: "Launch Party" },
      { id: 6, user: "Frank White", event: "Tech Conference" },
    ];
    setRegistrations(mockRegistrations);
  }, []);

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filteredRegistrations.slice(
    startIdx,
    startIdx + itemsPerPage
  );
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);

  return (
    <div className="">
    

      {/* Search Input */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search registrations..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white  rounded-tl-lg rounded-tr-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Name
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.map((reg) => (
              <tr key={reg.id}>
                <td className="px-6 py-4 whitespace-nowrap">{reg.user}</td>
                <td className="px-6 py-4 whitespace-nowrap">{reg.event}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                  No registrations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white px-4 py-3 rounded-br-lg rounded-bl-lg">
        <p className="text-sm text-gray-600">
          Showing {startIdx + 1} to{" "}
          {Math.min(startIdx + itemsPerPage, filteredRegistrations.length)} of{" "}
          {filteredRegistrations.length} results
        </p>
        <div className="flex items-center gap-2">
          <button
            className="p-2 border rounded-md"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium">{currentPage}</span>
          <button
            className="p-2 border rounded-md"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationTabDash;
