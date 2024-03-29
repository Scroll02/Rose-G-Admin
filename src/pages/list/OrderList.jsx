import Sidebar from "../../components/sidebar/Sidebar";
import "./list.scss";
import Navbar from "../../components/navbar/Navbar";
import OrderTable from "../../components/datatable/OrderTable";

const OrderList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <OrderTable datatableTitle={"List Of Orders"} />
      </div>
    </div>
  );
};

export default OrderList;
