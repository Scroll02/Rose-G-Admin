import { useState, useEffect } from "react";
import { activityLogColumns } from "../../datatablesource";
// MUI
import { DataGrid } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import moment from "moment";
// Firebase
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const ActivityLogTable = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");

  // Retrieve Activity Log data
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "ActivityLog"),
      (snapshot) => {
        const newData = [];

        snapshot.docs.forEach((doc) => {
          const activityLogData = doc.data().activityLogData || [];

          activityLogData.forEach((logData, index) => {
            const entry = {
              id: `${doc.id}-${index}`,
              uid: logData.uid,
              firstName: logData.firstName,
              profileImageUrl: logData.profileImageUrl,
              lastName: logData.lastName,
              lastLoginAt: new Date(logData.lastLoginAt),
              lastLogoutAt: logData.lastLogoutAt,
            };

            newData.push(entry);
          });
        });

        // Sort newData array in descending order based on lastLoginAt timestamp
        newData.sort((a, b) => b.lastLoginAt - a.lastLoginAt);

        setData(newData);
      }
    );

    return unsubscribe;
  }, []);

  // Filter data based on selected month and year
  const filteredData = data.filter((entry) => {
    if (selectedMonth && selectedYear) {
      const entryMonth = entry.lastLoginAt.getMonth(); // Adjust for zero-based index
      const entryYear = entry.lastLoginAt.getFullYear();
      return (
        entryMonth === parseInt(selectedMonth) && entryYear === selectedYear
      );
    } else if (selectedMonth) {
      const entryMonth = entry.lastLoginAt.getMonth(); // Adjust for zero-based index
      return entryMonth === parseInt(selectedMonth);
    } else if (selectedYear) {
      const entryYear = entry.lastLoginAt.getFullYear();
      return entryYear === selectedYear;
    }
    return true; // Return all data if no filters are selected
  });

  // Perform search based on selected column and query
  const searchedData = filteredData.filter((entry) => {
    if (selectedColumn && searchValue) {
      const columnValue = entry[selectedColumn];
      if (typeof columnValue === "string") {
        // Case-insensitive search for string values
        return columnValue.toLowerCase().includes(searchValue.toLowerCase());
      } else if (columnValue instanceof Date) {
        // Convert the search query to a Date object for date columns
        const queryDate = new Date(searchValue);
        return columnValue.toDateString() === queryDate.toDateString();
      }
    }
    return true; // Return all data if no search is performed
  });

  // Generate options for months and years based on available data
  const availableMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const availableYears = [
    ...new Set(data.map((entry) => entry.lastLoginAt.getFullYear())),
  ];

  // Available columns for search
  const availableColumns = [
    { key: "uid", label: "UID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "lastLoginAt", label: "Last Login" },
    { key: "lastLogoutAt", label: "Last Logout" },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <div className="datatableHeader">
          Activity Log
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              <option value="">Search Column</option>
              {availableColumns.map((column) => (
                <option key={column.key} value={column.key}>
                  {column.label}
                </option>
              ))}
            </select>
            <SearchRoundedIcon />
          </div>
        </div>
        <div className="filters">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {availableMonths.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={searchedData}
        columns={activityLogColumns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
};

export default ActivityLogTable;
