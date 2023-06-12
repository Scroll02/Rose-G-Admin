import defaultUserIcon from "./images/defaultUserIcon.png";
import moment from "moment";
/*------------------ User Column ------------------*/
export const userColumns = [
  {
    field: "uid",
    headerName: "User ID",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 230,
    headerClassName: "headerName",
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.profileImageUrl == "" ||
          params.row.profileImageUrl == null ? (
            <img
              className="cellImg"
              src={defaultUserIcon}
              alt={defaultUserIcon}
            />
          ) : (
            <img
              className="cellImg"
              src={params.row.profileImageUrl}
              alt="avatar"
            />
          )}
          {params.row.firstName}&nbsp;{params.row.lastName}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    headerClassName: "headerName",
  },

  {
    field: "contactNumber",
    headerName: "Contact Number",
    width: 160,
    headerClassName: "headerName",
  },
  {
    field: "address",
    headerName: "Address",
    width: 250,
    headerClassName: "headerName",
  },
  {
    field: "role",
    headerName: "Role",
    width: 160,
    headerClassName: "headerName",
  },
  // {
  //   field: "status",
  //   headerName: "Status",
  //   width: 160,
  //   headerClassName: "headerName",
  //   renderCell: (params) => {
  //     return (
  //       <div className={`cellWithStatus ${params.row.status}`}>
  //         {params.row.status}
  //       </div>
  //     );
  //   },
  // },

  // {
  //   field: "isVerified",
  //   headerName: "Email Verified",
  //   width: 150,
  //   renderCell: (params) => {
  //     return params.row.isVerified ? (
  //       <div className={`cellWithIsVerified ${params.row.status}`}>
  //         Verified
  //       </div>
  //     ) : (
  //       <div className={`cellWithIsVerified ${params.row.status}`}>
  //         Not Verified
  //       </div>
  //     );
  //   },
  // },

  {
    field: "emailVerified",
    headerName: "Email Verified",
    headerClassName: "headerName",
    width: 150,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithEmailVerified ${
            params.row.emailVerified == "Verified" ? "verified" : "notVerified"
          }`}
        >
          {params.row.emailVerified == "Verified" ? "Verified" : "Not Verified"}
        </div>
      );
    },
  },
];

/*------------------ Product Column ------------------*/
export const productColumns = [
  { field: "id", headerName: "Product ID", width: 120 },
  {
    field: "productName",
    headerName: "Product Name",
    width: 230,
    renderCell: (params) => {
      const criticalStock = params.row.criticalStock;
      const currentStock = params.row.currentStock;
      const textColor = currentStock <= criticalStock ? "red" : "inherit";
      const fontWeight = currentStock <= criticalStock ? 700 : "inherit";
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          <div style={{ color: textColor, fontWeight: fontWeight }}>
            {params.row.productName}
          </div>
        </div>
      );
    },
  },

  {
    field: "description",
    headerName: "Food Description",
    width: 230,
  },

  {
    field: "price",
    headerName: "Price",
    width: 120,
    renderCell: (params) => {
      return (
        <div>
          ₱
          {parseFloat(params.row.price)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      );
    },
  },

  {
    field: "categoryName",
    headerName: "Category",
    width: 150,
  },

  {
    field: "currentStock",
    headerName: "Stock",
    width: 100,
    renderCell: ({ row: { currentStock, criticalStock, initialStock } }) => {
      const textColor = currentStock <= criticalStock ? "red" : "inherit";
      return (
        <div
          style={{
            color: textColor,
            fontWeight: currentStock <= criticalStock ? 700 : "normal",
          }}
        >
          {currentStock || initialStock}
        </div>
      );
    },
  },
];

/*------------------ Product Categories Column ------------------*/
export const productCategoryColumns = [
  { field: "id", headerName: "Category ID", width: 160 },
  {
    field: "categoryName",
    headerName: "Category Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.categoryImg}
            alt="product-category-image"
          />
          {params.row.categoryName}
        </div>
      );
    },
  },
  {
    field: "slug",
    headerName: "Slug",
    width: 230,
  },
];

/*------------------ Order Columns ------------------*/
export const orderColumns = [
  { field: "orderId", headerName: "Order ID", width: 160 },
  {
    field: "customer",
    headerName: "Customer",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.customerProfileImg == null ? (
            <img
              className="cellImg"
              src={defaultUserIcon}
              alt="Default User Icon"
            />
          ) : (
            <img
              className="cellImg"
              src={params.row.customerProfileImg}
              alt="avatar"
            />
          )}
          <div className="customerName">
            <span>
              {params.row.orderFirstName}&nbsp;{params.row.orderLastName}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    field: "orderPayment",
    headerName: "Order Payment",
    width: 180,
  },
  {
    field: "orderTotalCost",
    headerName: "Order Total Cost",
    width: 150,
    renderCell: (params) => {
      return (
        <div>
          ₱
          {parseFloat(params.row.orderTotalCost)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      );
    },
  },

  {
    field: "orderDate",
    headerName: "Order Date",
    width: 210,
    renderCell: (params) => {
      return (
        <div>
          {moment(params.row.orderDate.toDate()).format("MMM D, YYYY h:mm A")}
        </div>
      );
    },
  },

  {
    field: "orderStatus",
    headerName: "Order Status",
    width: 160,
    renderCell: (params) => {
      const cellClassName = `cellOrderStatus ${params.row.orderStatus.replace(
        /\s/g,
        "-"
      )}`;
      return <div className={cellClassName}>{params.row.orderStatus}</div>;
    },
  },

  {
    field: "paymentStatus",
    headerName: "Payment Status",
    width: 150,
  },

  {
    field: "deliveryRiderName",
    headerName: "Delivery Rider",
    width: 180,
  },
];

/*------------------ Sales Report Columns ------------------*/
export const salesReportColumns = [
  {
    field: "productName",
    headerName: "Product",
    width: 250,
    renderCell: (params) => {
      const { categoryName, productName } = params.value;
      if (categoryName) {
        // If the current row is a category, show the category name in bold
        return <strong>{categoryName}</strong>;
      } else {
        // Otherwise, show the product name
        return productName;
      }
    },
  },
  {
    field: "unitCost",
    headerName: "Unit Cost",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "sellingPrice",
    headerName: "Selling Price",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "remained",
    headerName: "Remained",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "qtySold",
    headerName: "Qty. Sold",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "note",
    headerName: "Note",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "netProfit",
    headerName: "Net Profit",
    width: 120,
    headerClassName: "headerName",
  },
];

/*------------------ Activity Log Columns ------------------*/
export const activityLogColumns = [
  {
    field: "uid",
    headerName: "User ID",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 230,
    headerClassName: "headerName",
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.profileImageUrl == "" ||
          params.row.profileImageUrl == null ? (
            <img
              className="cellImg"
              src={defaultUserIcon}
              alt={defaultUserIcon}
            />
          ) : (
            <img
              className="cellImg"
              src={params.row.profileImageUrl}
              alt="avatar"
            />
          )}
          {params.row.firstName}&nbsp;{params.row.lastName}
        </div>
      );
    },
  },
  {
    field: "lastLoginAt",
    headerName: "Last Login At",
    width: 270,
    headerClassName: "headerName",
    valueGetter: (params) => {
      const lastLoginAt = params.row.lastLoginAt;
      return lastLoginAt
        ? moment(lastLoginAt).format("MMMM D, YYYY h:mm A")
        : "";
    },
  },
  {
    field: "lastLogoutAt",
    headerName: "Last Logout At",
    width: 270,
    headerClassName: "headerName",
    valueGetter: (params) => {
      const lastLogoutAt = params.row.lastLogoutAt;
      return lastLogoutAt
        ? moment(lastLogoutAt).format("MMMM D, YYYY h:mm A")
        : "";
    },
  },
];

/*------------------ Action Log Columns ------------------*/
export const actionLogColumns = [
  {
    field: "userId",
    headerName: "User ID",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 230,
    headerClassName: "headerName",
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.profileImageUrl == "" ||
          params.row.profileImageUrl == null ? (
            <img
              className="cellImg"
              src={defaultUserIcon}
              alt={defaultUserIcon}
            />
          ) : (
            <img
              className="cellImg"
              src={params.row.profileImageUrl}
              alt="avatar"
            />
          )}
          {params.row.firstName}&nbsp;{params.row.lastName}
        </div>
      );
    },
  },
  {
    field: "role",
    headerName: "Role",
    width: 150,
    headerClassName: "headerName",
  },
  {
    field: "timestamp",
    headerName: "Time Stamp",
    width: 270,
    headerClassName: "headerName",
    valueGetter: (params) => {
      const timestamp = params.row.timestamp;
      return timestamp ? moment(timestamp).format("MMMM D, YYYY h:mm A") : "";
    },
  },
  {
    field: "actionType",
    headerName: "Action Type",
    width: 150,
    headerClassName: "headerName",
  },
  {
    field: "actionDescription",
    headerName: "Action Description",
    width: 300,
    headerClassName: "headerName",
  },
];
