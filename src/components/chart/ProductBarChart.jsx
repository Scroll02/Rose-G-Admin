import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./productBarChart.scss";

const ProductBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "SalesReports"));
      const querySnapshot = await getDocs(q);
      const salesData = querySnapshot.docs.map((doc) => doc.data());
      const sortedData = salesData.sort(
        (a, b) => new Date(a.savedAt) - new Date(b.savedAt)
      );

      const filteredData = sortedData.filter((data) => {
        const currentDate = new Date(data.savedAt);
        const dataMonth = currentDate.getMonth() + 1;
        const dataYear = currentDate.getFullYear();
        return dataMonth === selectedMonth && dataYear === selectedYear;
      });

      const chartData = filteredData.map((data) => ({
        date: data.savedAt,
        quantitySoldTotal: data.quantitySoldTotal,
      }));

      setChartData(chartData);
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "SalesReports"));
      const querySnapshot = await getDocs(q);
      const salesData = querySnapshot.docs.map((doc) => doc.data());
      const yearsSet = new Set();

      salesData.forEach((data) => {
        const currentDate = new Date(data.savedAt);
        const dataYear = currentDate.getFullYear();
        yearsSet.add(dataYear);
      });

      const yearsArray = Array.from(yearsSet).sort().reverse();
      setAvailableYears(yearsArray);
    };

    fetchData();
  }, []);

  const generateMonthOptions = () => {
    const months = [
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

    return months.map((month, index) => {
      const monthValue = index + 1;
      return (
        <option value={monthValue} key={monthValue}>
          {month}
        </option>
      );
    });
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
    <div className="productBarChart">
      <h3>Sales</h3>
      <div className="selectContainer">
        <label htmlFor="monthSelect">Month:</label>
        <select
          id="monthSelect"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {generateMonthOptions()}
        </select>
        <label htmlFor="yearSelect">Year:</label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {generateYearOptions()}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            }
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantitySoldTotal">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index % 2 === 0 ? "#751c1a" : "#ffc500"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductBarChart;
