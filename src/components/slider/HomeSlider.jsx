import React from "react";
import "./slider.scss";
import { useState } from "react";
import Slider from "react-slick";
import TrashCan from "../../images/trash-can.png";

const PosterSlider = () => {
  const [homeSliderContent, setHomeSliderContent] = useState([
    { id: 1, content: "Banner 1", imageUrl: TrashCan },
    { id: 2, content: "Banner 2", imageUrl: TrashCan },
    { id: 3, content: "Banner 3", imageUrl: TrashCan },
  ]);

  const handleHomeSliderAdd = (newContent) => {
    const newId = homeSliderContent.length + 1;
    setHomeSliderContent([
      ...homeSliderContent,
      { id: newId, content: newContent },
    ]);
  };

  const handleHomeSliderDelete = (id) => {
    setHomeSliderContent(homeSliderContent.filter((item) => item.id !== id));
  };

  const handleHomeSliderEdit = (id, newContent) => {
    setHomeSliderContent(
      homeSliderContent.map((item) => {
        if (item.id === id) {
          return { ...item, content: newContent };
        }
        return item;
      })
    );
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0px",
    className: "sliderContainer",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerPadding: "0px",
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
    ],
  };
  return (
    <div className="sliderBody">
      <h1>Home Slider</h1>
      <button
        className="addBannerButton"
        onClick={() => handleHomeSliderAdd("New Banner")}
      >
        Add Banner
      </button>
      <div className="sliderWrapper">
        <Slider {...settings}>
          {homeSliderContent.map((item) => (
            <div key={item.id}>
              <div className="slideContainer">
                <img
                  src={item.imageUrl}
                  alt={item.content}
                  className="slideImage"
                />
                <div className="caption">
                  <h3 className="slideTitle">{item.content}</h3>
                  <div className="slideButtons">
                    <button
                      className="slideEditButton"
                      onClick={() =>
                        handleHomeSliderEdit(item.id, "New Content")
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="slideDeleteButton"
                      onClick={() => handleHomeSliderDelete(item.id)}
                    >
                      <img
                        src={TrashCan}
                        alt="Delete"
                        onClick={() => handleHomeSliderDelete(item.id)}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PosterSlider;
