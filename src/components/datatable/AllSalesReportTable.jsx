import React from "react";
import "./salesDataTable.scss";
import { useState, useEffect } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";

// Firebase
import {
  onSnapshot,
  collection,
  setDoc,
  doc,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";

// Toast
import { showSuccessToast, showErrorToast } from "../toast/Toast";

const AllSalesReportTable = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [salesReportData, setSalesReportData] = useState([]);

  // Retrieve Sales Report Data from database
  const retrieveSalesReport = async (selectedDate) => {
    const formattedDate = moment(selectedDate).format("MMMM DD, YYYY");

    const salesData = [];
    const querySnapshot = await getDocs(
      query(collection(db, "SalesReports"), where("date", "==", formattedDate))
    );
    querySnapshot.forEach((doc) => {
      const data = JSON.parse(doc.data().data);
      // console.log("doc.data().data:", doc.data().data);

      salesData.push({
        id: doc.id,
        reportID: doc.data().reportID,
        date: doc.data().date,
        categoryName: doc.data().categoryName,
        productName: doc.data().productName,
        price: doc.data().price,
        initialStock: doc.data().initialStock,
        currentStock: doc.data().currentStock,
        totalSold: doc.data().totalSold,
        savedAt: doc.data().savedAt,
        productData: data,
      });
    });
    setSalesReportData(salesData);
  };

  // If a date is selected, retrieve its data
  useEffect(() => {
    if (selectedDate) {
      retrieveSalesReport(selectedDate);
    }
  }, [selectedDate]);

  const handleDateSelect = (selectedDate) => {
    setSelectedDate(selectedDate);
    retrieveSalesReport(selectedDate);
  };

  // Sort the data table
  const groupBy = (array, key) => {
    const order = [
      "Palabok",
      "Rice Meals",
      "Barbecue",
      "Drinks",
      "Ice Cream",
      "Extras",
    ];
    const result = array.reduce((result, item) => {
      const category = item[key];
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(item);
      return result;
    }, {});
    // Sort categories based on the order array
    const sortedCategories = Object.keys(result).sort(
      (a, b) => order.indexOf(a) - order.indexOf(b)
    );
    return sortedCategories.reduce((obj, key) => {
      obj[key] = result[key];
      return obj;
    }, {});
  };

  // Download as CSV button function
  const handleDownloadCsv = () => {
    if (!selectedDate) {
      showErrorToast("Please select a date.", 2000);
      return;
    }

    const formattedDate = moment(selectedDate).format("MMMM DD, YYYY");
    const currentDate = moment().format("MMMM DD, YYYY");
    const table = document.querySelector("table");
    const csvString = [
      ...table.tHead.rows,
      ...table.tBodies[0].rows,
      ...table.tFoot.rows,
    ]
      .map((row) =>
        [...row.cells].map((cell) => `"${cell.innerText}"`).join(",")
      )
      .join("\n");

    const filename = `sales_report_${formattedDate}.csv`;
    const blob = new Blob(["\ufeff", csvString], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccessToast("Sales report downloaded successfully!", 2000);
    } else {
      showErrorToast("Error downloading sales report.", 2000);
    }
  };
  return (
    <div className="salesTableContainer">
      <div className="selectDateCalendar">
        <label>Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateSelect}
          dateFormat="MM/dd/yyyy"
          placeholderText="Select a date"
        />
      </div>
      <div className="salesTableHeader">
        <div className="headerTopRow">
          <div className="companyName">Rose Garden Special Palabok</div>
        </div>
        <div className="headerBottomRow">
          <div className="headerLeft">
            <div className="reportID">
              <label>Report ID:&nbsp;</label>
              <span>
                {salesReportData.length > 0 ? salesReportData[0].reportID : "-"}
              </span>
            </div>

            <div className="currentDate">
              <label>Date:&nbsp;</label>
              <span>
                {salesReportData.length > 0 ? salesReportData[0].date : "-"}
              </span>
            </div>
          </div>
          <div className="headerRight">
            <div className="salesTableButtons">
              <button onClick={handleDownloadCsv}>Download as CSV</button>
            </div>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Unit Cost</th>
            <th>Selling Price</th>
            <th>Stock</th>
            <th>Remained</th>
            <th>Qty Sold</th>
            <th>Amount</th>
            <th>Net Profit</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(
            groupBy(
              salesReportData.flatMap((p) => p.productData),
              "categoryName"
            )
          )
            .map(([categoryName, products]) => [
              <tr key={categoryName}>
                <td colSpan={8} className="categoryRow">
                  {categoryName}
                </td>
              </tr>,
              products.map((product) => (
                <tr key={product.id}>
                  {/* Product Name */}
                  <td>{product.productName}</td>

                  {/* Unit Cost */}
                  <td>
                    {(parseFloat(product.price) * 0.9)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>

                  {/* Selling Price */}
                  <td>
                    {parseFloat(product.price)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>

                  {/* Stock */}
                  <td>{product.initialStock || 0}</td>

                  {/* Remained (Remaining stocks) */}
                  <td>{product.currentStock || 0}</td>

                  {/* Quantity Sold */}
                  <td>{product.totalSold || 0}</td>

                  {/* Amount (Selling Price * Qty Sold) */}
                  <td>
                    {(parseFloat(product.price) * product.totalSold || 0)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>

                  {/* Net Profit - [Amount - (Unit Cost * Qty Sold)] */}
                  <td>
                    {(
                      parseFloat(product.price) * product.totalSold -
                        parseFloat(product.price) * 0.9 * product.totalSold || 0
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                </tr>
              )),
            ])
            .flat()}
        </tbody>

        <tfoot>
          <tr>
            <td>Total:</td>
            {/* Unit Cost */}
            <td>
              {salesReportData
                .flatMap((p) => p.productData)
                .reduce((acc, cur) => acc + parseFloat(cur.price * 0.9 || 0), 0)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </td>

            {/* Selling Price */}
            <td>
              {salesReportData
                .flatMap((p) => p.productData)
                .reduce((acc, cur) => acc + parseFloat(cur.price || 0), 0)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </td>

            {/* Stock */}
            <td>
              {salesReportData
                .flatMap((p) => p.productData)
                .reduce(
                  (acc, cur) => acc + parseFloat(cur.initialStock || 0),
                  0
                )}
            </td>

            {/* Remaining Stock */}
            <td>
              {salesReportData
                .flatMap((p) => p.productData)
                .reduce(
                  (acc, cur) => acc + parseFloat(cur.currentStock || 0),
                  0
                )}
            </td>

            {/* Quantity Sold */}
            <td>
              {salesReportData
                .flatMap((p) => p.productData)
                .reduce((acc, cur) => acc + parseFloat(cur.totalSold || 0), 0)}
            </td>

            {/* Amount (Selling Price * Qty Sold) */}
            <td>
              {salesReportData
                .flatMap((p) => p.productData)
                .reduce(
                  (acc, cur) =>
                    acc + parseFloat(cur.price * cur.totalSold || 0),
                  0
                )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </td>

            {/* Net Profit - [Amount - (Unit Cost * Qty Sold)] */}
            <td>
              {salesReportData
                .flatMap((p) => p.productData)
                .reduce(
                  (acc, cur) =>
                    acc +
                    parseFloat(
                      cur.price * cur.totalSold -
                        cur.price * 0.9 * cur.totalSold || 0
                    ),
                  0
                )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default AllSalesReportTable;
