import React from "react";

const Pagination = ({ page, setPage, totalItems, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="pagination-container d-flex justify-content-center align-items-center mt-4">
      <button
        className="btn btn-primary me-2"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 0}
      >
        Previous
      </button>

      <div className="pagination-numbers">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn mx-1 ${
              index === page ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary ms-2"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages - 1}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
