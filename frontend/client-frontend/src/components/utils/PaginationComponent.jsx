import React from 'react';
import ReactPaginate from "react-paginate";

const PaginationComponent = ({ pageCount, onPageChange }) => {
    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={onPageChange}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="<"
            containerClassName="flex gap-2"
            pageClassName="px-3 py-1 bg-white text-black rounded-md border-2"
            activeClassName="opacity-50"
        />
    );
};

export default PaginationComponent;