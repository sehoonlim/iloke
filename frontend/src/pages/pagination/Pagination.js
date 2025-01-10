import React from "react";
import "./Pagination.css";

function Pagination(props) {
  return (
    <div class="pagination-container">
      <div class="pagination-controls">
        <ul>
          <li>
            <a href="#" class="current">
              1
            </a>
          </li>
          <li>
            <a href="#">2</a>
          </li>
          <li>
            <a href="#">3</a>
          </li>
          <li>
            <a href="#">4</a>
          </li>
          <li>
            <a href="#">5</a>
          </li>
          <li>
            <a href="#">6</a>
          </li>
          <li>
            <a href="#">7</a>
          </li>
          <li>
            <a href="#">8</a>
          </li>
          <li>
            <a href="#">9</a>
          </li>
          <li>
            <a href="#">10</a>
          </li>
          <li class="pagination-next">
            <a href="#">＞</a>
          </li>
          <li class="pagination-last">
            <a href="#">≫</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Pagination;
