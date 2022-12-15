import "./widget.scss"
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

const Widget = ({ type }) => {
    let data;

    //temporary
const amount =100;
const diff =20;

    switch(type){
        case "user":
        data = {
            title: "USERS",
            isMoney: false,
            link: "See all users",
            icon: (
              <Person2RoundedIcon
                className="icon"
                style={{ backgroundColor: "#BCC99B", color:"green"}}
              />
            ),
          };
        break;
            case "order":
            data = {
                title: "ORDERS",
                isMoney: false,
                link: "View all orders",
                icon: (
                <BorderColorRoundedIcon
                className="icon"
                style={{ backgroundColor: "#E8B0AF", color:"#742a40"}}
              />
            ),
          };
        break;
            case "earnings":
            data = {
                title: "EARNINGS",
                isMoney: true,
                link: "View net earnings",
                icon: (
                  <PaidRoundedIcon
                    className="icon"
                    style={{ backgroundColor: "#E3686B", color:"#451926"}}
                  />
                ),
              };
        break;
            case "balance":
            data = {
                title: "BALANCE",
                isMoney: true,
                link: "View Balance",
                icon: (
                  <AccountBalanceWalletRoundedIcon
                    className="icon"
                    style={{ backgroundColor: "#C26522", color: "#332211"}}
                  />
                ),
              };
        break;
        default:
        break;
    }



  return (
    <div className="widget">
        <div className="left">
            <span className="title">{data.title}</span>
            <span className="counter">{data.isMoney && "$"} {amount}</span>
            <span className="link">{data.link}</span>
        </div>
        <div className="right">
            <div className="percentage positive">
            <KeyboardArrowUpRoundedIcon/>
                {diff} %
            </div>
            {data.icon}
        </div>
    </div>
  )
}

export default Widget
