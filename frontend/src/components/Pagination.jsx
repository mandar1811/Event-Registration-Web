import React from 'react';

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const pageNumbers = [];
  
  // Create page number array
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Show just a window of pages around current page if many pages
  const getPageWindow = () => {
    if (totalPages <= 5) return pageNumbers;
    
    if (currentPage <= 3) {
      return [...pageNumbers.slice(0, 5), '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      return [1, '...', ...pageNumbers.slice(totalPages - 5)];
    } else {
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  };

  const displayPages = getPageWindow();
  
  return (
    <nav className="flex justify-center mt-4">
      <ul className="inline-flex items-center space-x-2">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border text-sm ${
              currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-blue-100'
            }`}
          >
            Prev
          </button>
        </li>

        {/* Page Numbers */}
        {displayPages.map((num, index) => (
          <li key={index}>
            {num === '...' ? (
              <span className="px-3 py-1 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => paginate(num)}
                className={`px-3 py-1 rounded-md border text-sm ${
                  currentPage === num ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
                }`}
              >
                {num}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border text-sm ${
              currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-blue-100'
            }`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
