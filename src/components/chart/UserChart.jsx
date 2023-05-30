import { useState, useEffect } from "react";
import "./userChart.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Firebase
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const UserChart = () => {
  const [userData, setUserData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "UserData"),
        where("role", "==", "Customer")
      );
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => doc.data());
      const usersPerMonth = {};

      const monthNames = [
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

      const yearsSet = new Set();

      usersData.forEach((user) => {
        if (user.createdAt) {
          const createdAt = new Date(user.createdAt.toDate().toString());
          const year = createdAt.getFullYear();
          yearsSet.add(year);
        }
      });

      const yearsArray = Array.from(yearsSet).sort().reverse();
      setAvailableYears(yearsArray);

      // Initialize usersPerMonth with zeros for all months
      monthNames.forEach((monthName) => {
        usersPerMonth[monthName] = 0;
      });

      usersData.forEach((user) => {
        if (user.createdAt) {
          const createdAt = new Date(user.createdAt.toDate().toString());
          const year = createdAt.getFullYear();

          if (selectedYear === "" || year.toString() === selectedYear) {
            const monthName = monthNames[createdAt.getMonth()];
            usersPerMonth[monthName] += 1;
          }
        }
      });

      const userDataArray = Object.entries(usersPerMonth).map(
        ([monthName, users]) => ({
          date: monthName,
          users,
        })
      );

      setUserData(userDataArray);
    };

    fetchData();
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const renderCustomDot = (props) => {
    const { cx, cy, stroke, payload } = props;
    const { users } = payload;

    if (users === 0) {
      return <circle cx={cx} cy={cy} r={6} fill="#ffc500" />;
    }

    return <circle cx={cx} cy={cy} r={6} stroke={stroke} fill="#ffc500" />;
  };

  return (
    <div className="userChart">
      <h3>Number Of Customers Per Month</h3>
      <div className="selectYear">
        <label htmlFor="year">Select Year: </label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          <option value="">All</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={userData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#751c1a"
            activeDot={{ r: 8 }}
            dot={renderCustomDot}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
