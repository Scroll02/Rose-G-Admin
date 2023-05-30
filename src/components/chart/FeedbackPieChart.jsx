import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./feedbackPieChart.scss";
// Firebase
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../firebase";

const FeedbackPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "FeedbackData"));
      const feedbackData = querySnapshot.docs.map((doc) => doc.data());
      setData(feedbackData);
    };

    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const ratingCounts = [0, 0, 0, 0, 0];

  data.forEach((feedback) => {
    const rating = feedback.rating;
    ratingCounts[rating - 1] += 1;
  });

  const chartData = ratingCounts.map((count, index) => ({
    rating: `${index + 1} Stars`,
    count,
  }));

  return (
    <div className="pieChartContainer">
      <h3>Customer Feedback Ratings</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="rating"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          {/* <Tooltip /> */}
          <Legend
            wrapperStyle={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
            contentStyle={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedbackPieChart;
