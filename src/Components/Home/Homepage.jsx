import React from "react";
import SearchInput from "../Search/SearchInput";
import PopularLine1 from "./PopularLine1";
import PopularLine from "./PopularLine";
const Homepage = () => {
  return (
    <div>
      <div>
        <h2 class="text-center mt-5">Tìm Kiếm Tuyến Xe</h2>
        <SearchInput />
      </div>
      <div className="container p-0">
        <h2 class="section-title text-center my-5">Tuyến Phổ Biến</h2>
        <div class="row">
          <PopularLine />
          <PopularLine />
          <PopularLine />
        </div>
      </div>
    </div>
  );
};
export default Homepage;