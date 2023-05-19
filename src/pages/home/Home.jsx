import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import OrderTable from "../../components/datatable/OrderTable";
import LatestTransaction from "../../components/table/LatestTransaction";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />

        <div className="widgets">
          <Widget type="user" />
          <Widget type="product" />
          <Widget type="earnings" />
          {/* <Widget type="order" /> */}
        </div>
        <div className="widgets">
          <Widget type="orderPending" />
          <Widget type="orderConfirmed" />
          <Widget type="orderPrepared" />
          <Widget type="orderDelivery" />
          <Widget type="orderDelivered" />
          <Widget type="orderCancelled" />
        </div>

        {/* <div className="listContainer">
          <div className="listTitle">Latest Orders</div>
          <LatestTransaction />
        </div> */}

        {/* Charts */}
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>

        {/* Latest Orders Table */}
        {/* <div className="listContainer">
          <OrderTable datatableTitle={"Latest Orders"} />
        </div> */}

        {/* <div className="listContainer">
          <div className="listTitle">Latest Transaction</div>
          <Table />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
