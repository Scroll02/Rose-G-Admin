import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import {
  doc,
  collection,
  setDoc,
  addDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import moment from "moment";
// Toast
import { showSuccessToast, showErrorToast } from "../../components/toast/Toast";

const SingleActionLog = () => {
  const { actionLogId } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    const getActionLogData = async () => {
      try {
        const [year, month, index] = actionLogId.split("-");
        const docId = `${year}-${month}`;
        const docRef = doc(db, "ActivityLog", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const actionLogData = docSnap.data().actionLogData;
          const specificData = actionLogData[index];
          setData(specificData ? specificData : null);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    getActionLogData();
  }, [actionLogId]);

  const actionTypeClassName = `itemValue ${
    data?.actionType ? data?.actionType.replace(/\s/g, "-") : ""
  }`;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            {/* <div className="editButton">Save</div> */}
            <h1 className="title">Action Log Details</h1>
            <div className="item">
              <div className="details">
                {/*------------------ Order ID ------------------*/}
                <h1 className="itemTitle">Action Log ID: {actionLogId}</h1>

                {/*------------------ Full Name ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Customer Full Name:</span>
                  <span className="itemValue">
                    {data?.firstName}&nbsp;
                    {data?.lastName}
                  </span>
                </div>

                {/*------------------ Action Type ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Action Type:</span>
                  <span className={actionTypeClassName}>
                    {data?.actionType}
                  </span>
                </div>

                {/*------------------ Action Description ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Action Description:</span>
                  <span className="itemValue">{data?.actionDescription}</span>
                </div>

                {/*------------------ Time Stamp ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Time Stamp:</span>
                  <span className="itemValue">
                    {moment(data?.timestamp).format("MMMM D, YYYY h:mm A")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          {/*------------------ Order Summary ------------------*/}
          {data?.createdFields && (
            <div className="fieldsContainer">
              <div className="fieldsSummary">
                <h2 className="fieldsTitle">Created Fields</h2>
                <table className="fieldsTable">
                  <thead>
                    <tr>
                      <th>Field Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.createdFields &&
                      data.createdFields.map((fieldData, index) => (
                        <tr key={index}>
                          <td>{fieldData.field}</td>
                          <td>{fieldData.value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {data?.updatedFields && (
            <div className="fieldsContainer">
              <div className="fieldsSummary">
                <h2 className="fieldsTitle">Updated Fields</h2>
                <table className="fieldsTable">
                  <thead>
                    <tr>
                      <th>Field Name</th>
                      <th>New Value</th>
                      <th>Old Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.updatedFields &&
                      data.updatedFields.map((fieldData, index) => (
                        <tr key={index}>
                          <td>{fieldData.field}</td>
                          <td>{fieldData.newValue}</td>
                          <td>{fieldData.oldValue}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {data?.deletedFields && (
            <div className="fieldsContainer">
              <div className="fieldsSummary">
                <h2 className="fieldsTitle">Deleted Fields</h2>
                <table className="fieldsTable">
                  <thead>
                    <tr>
                      <th>Field Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.deletedFields &&
                      data?.deletedFields.map((fieldData, index) => (
                        <tr key={index}>
                          <td>{fieldData.field}</td>
                          <td>{fieldData.value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleActionLog;
