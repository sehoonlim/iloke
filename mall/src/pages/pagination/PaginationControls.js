import React from 'react';
import './PaginationControls.css'; // 스타일을 위한 CSS 파일을 import 합니다.

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="pagination-link"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {'<'}
      </button>
      {pageNumbers.map((page) => (
        <a
          key={page}
          href="#"
          className={`pagination-link ${page === currentPage ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault(); // 링크 기본 동작 방지
            onPageChange(page);
          }}
        >
          {page}
        </a>
      ))}
      <button
        className="pagination-link"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {'>'}
      </button>
    </div>
  );
}

export default PaginationControls;
