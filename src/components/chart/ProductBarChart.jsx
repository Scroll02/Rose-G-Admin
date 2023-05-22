import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
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

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "SalesReports"));
      const querySnapshot = await getDocs(q);
      const salesData = querySnapshot.docs.map((doc) => doc.data());
      const sortedData = salesData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
      const chartData = sortedData.map((data) => ({
        date: data.date,
        quantitySoldTotal: data.quantitySoldTotal,
      }));
      setChartData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div className="productBarChart">
      <h3>Total Sold Products Per Day</h3>
      <ResponsiveContainer width={850} height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          {/* <Legend
          wrapperStyle={{
            fontSize: "16px",
            fontWeight: "bold",
          }}
          contentStyle={{
            fontSize: "16px",
            fontWeight: "bold",
          }}
        /> */}
          <Bar dataKey="quantitySoldTotal" fill="#751c1a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductBarChart;
