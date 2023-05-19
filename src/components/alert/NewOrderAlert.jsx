import React, { useState, useEffect, useRef } from "react";
import "./newOrderAlert.scss";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CloseIcon from "@mui/icons-material/Close";
import AlertSound from "../../audio/alert-sound2.mp3";

const NewOrderAlert = ({ orderCount, closeNewOrderAlert }) => {
  const audioRef = useRef(null);
  const [playAudio, setPlayAudio] = useState(false);

  useEffect(() => {
    if (orderCount > 0) {
      setPlayAudio(true);
    } else {
      setPlayAudio(false);
      pauseAudio();
    }
  }, [orderCount]);

  const handleAlertClose = () => {
    closeNewOrderAlert();
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      pauseAudio();
    };
  }, []);

  return (
    <div className="newOrderAlert">
      <Alert
        severity="info"
        className={playAudio ? "with-audio" : ""}
        onClick={handlePlayAudio}
      >
        <div className="alertContent">
          <div className="alertHeader">
            <AlertTitle className="alertTitle">
              {orderCount}&nbsp;New Order
            </AlertTitle>
            <CloseIcon onClick={handleAlertClose} className="closeIcon" />
          </div>
          <div className="alertDescription">
            <p>There is new food orders.</p>
            <p>
              <Link to="/orders" className="viewOrdersLink">
                View Orders
              </Link>
            </p>
          </div>
        </div>
      </Alert>
      {playAudio && <audio ref={audioRef} src={AlertSound} autoPlay loop />}
    </div>
  );
};

export default NewOrderAlert;
