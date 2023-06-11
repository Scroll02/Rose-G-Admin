import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import FeedbackPieChart from "../../components/chart/FeedbackPieChart";
import ProductBarChart from "../../components/chart/ProductBarChart";
import BestSellingBarChart from "../../components/chart/BestSellingBarChart";
import UserChart from "../../components/chart/UserChart";
import Table from "../../components/table/Table";
import OrderTable from "../../components/datatable/OrderTable";
import LatestTransaction from "../../components/table/LatestTransaction";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />

        {/* <div className="widgets">
          <Widget type="user" />
          <Widget type="product" />
          <Widget type="earnings" />
        </div> */}
        <div className="widgets">
          <Widget type="orderPending" />
          <Widget type="orderConfirmed" />
          <Widget type="orderPrepared" />
          <Widget type="orderDelivery" />
          <Widget type="orderCompleted" />
          <Widget type="orderCancelled" />
        </div>

        {/* <div className="listContainer">
          <div className="listTitle">Latest Orders</div>
          <LatestTransaction />
        </div> */}

        {/* Charts */}
        {/* <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div> */}
        <div className="charts">
          <BestSellingBarChart />
          <ProductBarChart />
        </div>
        <div className="charts">
          <FeedbackPieChart />
          <UserChart />
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
