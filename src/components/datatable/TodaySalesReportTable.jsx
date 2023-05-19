import React from "react";
import "./salesDataTable.scss";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import Papa from "papaparse";

// Firebase
import {
  onSnapshot,
  collection,
  setDoc,
  doc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

// Toast
import { showSuccessToast, showErrorToast } from "../toast/Toast";

const TodaySalesReportTable = () => {
  const [data, setData] = useState([]);

  const resetTime = moment().endOf("day").add(1, "hour");

  // useEffect(() => {
  //   const unsub = onSnapshot(collection(db, "ProductData"), (snapShot) => {
  //     setData(snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  //   });
  //   return () => unsub();
  // }, [resetTime.diff(moment()) > 0]);
  useEffect(() => {
    const checkResetTime = setInterval(() => {
      if (moment() > resetTime) {
        setData([]);
      }
    }, 1000); // Check every second

    const unsub = onSnapshot(collection(db, "ProductData"), (snapShot) => {
      setData(snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      clearInterval(checkResetTime);
      unsub();
    };
  }, []);

  const generateReportID = () => {
    const currentDate = moment().format("YYYY-MM-DD");
    return `sales_report_${currentDate}`;
  };

  // Get current date using Moment library
  const currentDate = moment().format("MMMM DD, YYYY");

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

    const filename = `sales_report_${currentDate}.csv`;
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

  // Save button function
  const saveSalesReport = () => {
    const reportID = generateReportID();
    const now = new Date();
    const savedAt = now.toISOString();

    // Calculate the totals
    const unitCostTotal = data.reduce(
      (acc, cur) => acc + parseFloat(cur.price * 0.9 || 0),
      0
    );
    const sellingPriceTotal = data.reduce(
      (acc, cur) => acc + parseFloat(cur.price || 0),
      0
    );
    const stockTotal = data.reduce(
      (acc, cur) => acc + parseFloat(cur.initialStock || 0),
      0
    );
    const remainingStockTotal = data.reduce(
      (acc, cur) => acc + parseFloat(cur.currentStock || 0),
      0
    );
    const quantitySoldTotal = data.reduce(
      (acc, cur) => acc + parseFloat(cur.totalSold || 0),
      0
    );
    const amountTotal = data.reduce(
      (acc, cur) => acc + parseFloat(cur.price * cur.totalSold || 0),
      0
    );
    const netProfitTotal = data.reduce(
      (acc, cur) =>
        acc +
        parseFloat(
          cur.price * cur.totalSold - cur.price * 0.9 * cur.totalSold || 0
        ),
      0
    );

    // Prepare the data object to be saved
    const salesData = {
      reportID,
      date: currentDate,
      data: JSON.stringify(data),
      savedAt: savedAt,
      unitCostTotal,
      sellingPriceTotal,
      stockTotal,
      remainingStockTotal,
      quantitySoldTotal,
      amountTotal,
      netProfitTotal,
    };

    // Save the data object to the database
    addDoc(collection(db, "SalesReports"), salesData)
      .then(() => {
        showSuccessToast("Sales report saved to database!", 2000);
      })
      .catch((error) => {
        showErrorToast(
          `Error saving sales report to database: ${error.message}`,
          2000
        );
      });
  };

  return (
    <div className="salesTableContainer">
      <div className="salesTableHeader">
        <div className="headerTopRow">
          <div className="companyName">Rose Garden Special Palabok</div>
        </div>
        <div className="headerBottomRow">
          <div className="headerLeft">
            <div className="reportID">
              <label>Report ID:&nbsp;</label>
              <span>{generateReportID()}</span>
            </div>
            <div className="currentDate">
              <label>Date:&nbsp;</label>
              <span>{currentDate}</span>
            </div>
          </div>
          <div className="headerRight">
            <div className="salesTableButtons">
              <button onClick={handleDownloadCsv}>Download as CSV</button>
              <button onClick={saveSalesReport}>Save</button>
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
          {Object.entries(groupBy(data, "categoryName")).map(
            ([categoryName, products]) => (
              <>
                <tr key={`category_${categoryName}`} className="categoryRow">
                  <td colSpan="9">{categoryName}</td>
                </tr>
                {products.map((product) => (
                  <tr key={product.id}>
                    {/* Product Name */}
                    <td>{product.productName}</td>

                    {/* Unit Cost */}
                    <td>
                      {parseFloat(product.price * 0.9 || 0)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>

                    {/* Selling Price */}
                    <td>
                      {parseFloat(product.price || 0)
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
                      {parseFloat(product.price * product.totalSold || 0)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>

                    {/* Net Profit - [Amount - (Unit Cost * Qty Sold)] */}
                    <td>
                      {parseFloat(
                        product.price * product.totalSold -
                          product.price * 0.9 * product.totalSold || 0
                      )
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                  </tr>
                ))}
              </>
            )
          )}
        </tbody>

        <tfoot>
          <tr>
            <td>Total:</td>
            {/* Unit Cost */}
            <td>
              {data
                .reduce((acc, cur) => acc + parseFloat(cur.price * 0.9 || 0), 0)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </td>

            {/* Selling Price */}
            <td>
              {data
                .reduce((acc, cur) => acc + parseFloat(cur.price || 0), 0)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </td>

            {/* Stock */}
            <td>
              {data.reduce(
                (acc, cur) => acc + parseFloat(cur.initialStock || 0),
                0
              )}
            </td>

            {/* Remaining Stock */}
            <td>
              {data.reduce(
                (acc, cur) => acc + parseFloat(cur.currentStock || 0),
                0
              )}
            </td>

            {/* Quantity Sold */}
            <td>
              {data.reduce(
                (acc, cur) => acc + parseFloat(cur.totalSold || 0),
                0
              )}
            </td>

            {/* Amount (Selling Price * Qty Sold) */}
            <td>
              {data
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
              {data
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

export default TodaySalesReportTable;
