import NavSearch from "./NavSearch";
import CarriageWay from "./CarriageWay";
import TestSearch from "./SearchInput";

const Search = () => {
  return (
    <div>
      {/* Main form for bus ticket search */}
      <TestSearch />
      <div className="d-flex container p-0">
        {/* Sorting and Filtering section */}
        <div>
          <NavSearch />
        </div>
        <div className="flex-grow-1 ps-3">
          <CarriageWay />
        </div>
      </div>
    </div>
  );
};

export default Search;
