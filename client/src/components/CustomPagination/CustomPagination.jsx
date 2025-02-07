import Pagination from 'react-js-pagination';

const CustomPagination = ({
  activePage,
  itemsCountPerPage,
  totalItemsCount,
  onChange,
}) => {
  return (
    <div className="mt-6 flex justify-center">
      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsCountPerPage}
        totalItemsCount={totalItemsCount}
        pageRangeDisplayed={5}
        onChange={onChange}
        itemClass="inline-block mx-1"
        linkClass="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
        activeClass="bg-blue-500 text-white"
        activeLinkClass="bg-blue-500 text-white"
        disabledClass="opacity-50 cursor-not-allowed"
        prevPageText="‹"
        nextPageText="›"
        firstPageText="«"
        lastPageText="»"
      />
    </div>
  );
};

export default CustomPagination;
