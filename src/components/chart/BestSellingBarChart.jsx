import React, { useState, useEffect } from "react";
import "./bestSellingBarChart.scss";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const BestSellingBarChart = () => {
  const [productData, setProductData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const salesReportsRef = collection(db, "SalesReports");
      const salesReportsSnapshot = await getDocs(salesReportsRef);

      let productTotals = {};
      let products = [];

      salesReportsSnapshot.forEach((doc) => {
        const savedAt = doc.data().savedAt; // Get the savedAt field
        const data = JSON.parse(doc.data().data); // Parse the data field

        // Calculate totalSold for each product
        data.forEach((product) => {
          if (
            product &&
            product.productId &&
            !isNaN(parseFloat(product.totalSold))
          ) {
            const productId = product.productId;
            const productName = product.productName;
            const totalSold = parseFloat(product.totalSold); // Parse totalSold as a number

            const orderYear = new Date(savedAt).getFullYear(); // Extract the year from savedAt field

            // Check if the order year matches the selected year
            if (!selectedYear || orderYear === parseInt(selectedYear)) {
              if (productTotals.hasOwnProperty(productId)) {
                productTotals[productId] += totalSold;
              } else {
                productTotals[productId] = totalSold;
              }

              // Store the product object
              products.push({
                productId,
                productName,
              });
            }
          }
        });
      });

      // Sort products based on totalSold in descending order
      const sortedProducts = Object.keys(productTotals).sort(
        (a, b) => productTotals[b] - productTotals[a]
      );

      // Get the top 10 products with the highest totalSold
      const topProducts = sortedProducts.slice(0, 10);

      // Retrieve the product objects for the top products
      const bestSellingProducts = topProducts.map((productId) => ({
        productName: products.find((product) => product.productId === productId)
          ?.productName,
        totalSold: productTotals[productId],
      }));

      setProductData(bestSellingProducts);
    };

    fetchData();
  }, [selectedYear]);

  useEffect(() => {
    const fetchData = async () => {
      const salesReportsRef = collection(db, "SalesReports");
      const salesReportsSnapshot = await getDocs(salesReportsRef);
      const yearsSet = new Set();

      salesReportsSnapshot.forEach((doc) => {
        const savedAt = doc.data().savedAt;
        const orderYear = new Date(savedAt).getFullYear();
        yearsSet.add(orderYear);
      });

      const yearsArray = Array.from(yearsSet).sort().reverse();
      setAvailableYears(yearsArray);
    };

    fetchData();
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value); // Update the selected year
  };

  const generateYearOptions = () => {
    return availableYears.map((year) => {
      return (
        <option value={year} key={year}>
          {year}
        </option>
      );
    });
  };

  return (
    <div className="bestSellingBarChart">
      <h3>10 Best Selling Products</h3>
      <div className="yearSelection">
        <label htmlFor="year">Select Year: </label>
        <select id="year" onChange={handleYearChange}>
          <option value="">All</option>
          {generateYearOptions()}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={productData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSold">
            {productData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index % 2 === 0 ? "#751c1a" : "#ffc500"} // Alternate between two colors
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BestSellingBarChart;
