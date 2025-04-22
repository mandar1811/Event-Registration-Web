import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const UserTabDash = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const mockUsers = [
      { id: 1, username: "alice_j", email: "alice@example.com", role: "Admin" },
      { id: 2, username: "bob_smith", email: "bob@example.com", role: "User" },
      { id: 3, username: "carol_lee", email: "carol@example.com", role: "User" },
      { id: 4, username: "david_kim", email: "david@example.com", role: "Admin" },
      { id: 5, username: "eve_thomas", email: "eve@example.com", role: "User" },
      { id: 6, username: "frank_white", email: "frank@example.com", role: "User" },
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filteredUsers.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="">
    
      {/* Search Input */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
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
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        user.role === "Admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between shadow-lg items-center bg-white px-4 py-3 rounded-br-lg rounded-bl-lg">
        <p className="text-sm text-gray-600">
          Showing {startIdx + 1} to{" "}
          {Math.min(startIdx + itemsPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} results
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
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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

export default UserTabDash;
