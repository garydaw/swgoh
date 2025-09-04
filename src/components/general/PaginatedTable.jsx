import React, { useState, useMemo } from "react";
import css from "./PaginatedTable.module.css";

export default function PaginatedTable({ dataToDisplay }) {
  const firstKey = Object.keys(dataToDisplay[0])[0];
  const [sortColumn, setSortColumn] = useState(firstKey);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (key) => {
    if (sortColumn === key) {
      // toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return dataToDisplay;

    return [...dataToDisplay].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [dataToDisplay, sortColumn, sortDirection]);

  return (
    <table className={css.paginatedTable}>
      <thead>
        <tr>
          {Object.keys(dataToDisplay[0]).map((key) => (
            <th
              key={"mod_" + key}
              onClick={() => handleSort(key)}
              className={css.clickableHeader}
            >
              {key.toUpperCase()}
              {sortColumn === key && (sortDirection === "asc" ? " ▲" : " ▼")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((obj, index) => (
          <tr key={"mod_row_" + index}>
            {Object.keys(obj).map((key) => (
              <td key={"mod_row_" + index + "_" + key}>{obj[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
