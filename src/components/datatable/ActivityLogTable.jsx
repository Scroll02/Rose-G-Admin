import { useState, useEffect } from "react";
import { activityLogColumns } from "../../datatablesource";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
// Navigation
import { Link } from "react-router-dom";
// Firebase
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";

const ActivityLogTable = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "ActivityLog"),
      (snapshot) => {
        const newData = [];

        snapshot.docs.forEach((doc) => {
          const activityLogData = doc.data().activityLogData || [];

          activityLogData.forEach((logData, index) => {
            const entry = {
              id: `${doc.id}-${index}`, // Generate a unique ID for each entry
              uid: logData.uid,
              firstName: logData.firstName,
              profileImageUrl: logData.profileImageUrl,
              lastName: logData.lastName,
              lastLoginAt: new Date(logData.lastLoginAt), // Convert to Date object
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

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Activity Log
        {/* <div className="datatableButtons">
          <Link to="/products/newCategory" className="link">
            New Category
          </Link>
        </div> */}
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={activityLogColumns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
};

export default ActivityLogTable;
