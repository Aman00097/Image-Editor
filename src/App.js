import { useState } from 'react';
import './App.css';
import { GrRotateLeft } from 'react-icons/gr';
import { GrRotateRight } from 'react-icons/gr';
import { BiReflectVertical } from 'react-icons/bi';
import { BiReflectHorizontal } from 'react-icons/bi';
import defaultImg from './Image/image-placeholder.jpg'

function App() {
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [inversion, setInversion] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);
  const [sliderValue, setSliderValue] = useState('100');
  const [img, setImg] = useState();
  const [filterBtn, setFilterBtn] = useState("Brightness");

  const chooseFile = () => {
    let fileInput = document.querySelector("#file_input");
    fileInput.click();
  }

  const applyFilter = () => {
    let image = document.querySelector(".image img");
    image.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    image.style.transform = `rotate(${rotate}deg) scale(${flipVertical}, ${flipHorizontal})`;
  }

  const imgFilter = (e) => {
    let id = e.target.id;
    if (id === "brightness") {
      setFilterBtn("Brightness");
      setSliderValue(brightness);
    } else if (id === "saturation") {
      setFilterBtn("Saturation");
      setSliderValue(saturation);
    } else if (id === "inversion") {
      setFilterBtn("Inversion");
      setSliderValue(inversion);
    } else if (id === "grayscale") {
      setFilterBtn("Grayscale");
      setSliderValue(grayscale);
    }
  }
  const handleSlider = (e) => {
    setSliderValue(e.target.value);
    switch (filterBtn) {
      case "Brightness":
        setBrightness(e.target.value);
        break;
      case "Saturation":
        setSaturation(e.target.value);
        break;
      case "Inversion":
        setInversion(e.target.value);
        break;
      default:
        setGrayscale(e.target.value);
    }
    applyFilter();
  }
  const imgRotate = (e) => {
    let id = e.target.id;
    if (id === "left") {
      setRotate(rotate - 90);
    } else if (id === "right") {
      setRotate(rotate + 90);
    } else if (id === "vertical") {
      setFlipVertical(flipVertical === 1 ? -1 : 1);
    } else {
      setFlipHorizontal(flipHorizontal === 1 ? -1 : 1);
    }
    applyFilter();
  }

  const loadImg = (e) => {
    let file = e.target.files[0];
    if (!file) return;
    setImg(file);
    resetFilter();
  }
  const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (rotate !== 0) {
        ctx.rotate((rotate * Math.PI) / 180);
      }
      ctx.scale(flipHorizontal, flipVertical);
      ctx.drawImage(
        image,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );
      const link = document.createElement("a");
      link.download = "img.jpg";
      link.href = canvas.toDataURL();
      link.click();
    };
    image.src = URL.createObjectURL(img);
  };


  const resetFilter = () => {
    setBrightness("100");
    setSaturation("100");
    setInversion("0");
    setGrayscale("0");
    setRotate(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
    setFilterBtn("Brightness");
    setSliderValue(100);
  }

  if (img) applyFilter();
  return (
    <>
      <main>
        <div className={`container ${!img ? "disable" : ""}`}>
          <h1>Image Editor</h1>
          <div className="content">
            <div className="image">
              <img src={img ? URL.createObjectURL(img) : defaultImg} alt="img" />
            </div>
            <div className="editor_panel">
              <div className="filter">
                <label>Filters</label>
                <div className="options">
                  <button id="brightness" className={filterBtn === "Brightness" ? "active" : ""} onClick={imgFilter}>Brightness</button>
                  <button id="saturation" className={filterBtn === "Saturation" ? "active" : ""} onClick={imgFilter}>Saturation</button>
                  <button id="inversion" className={filterBtn === "Inversion" ? "active" : ""} onClick={imgFilter}>Inversion</button>
                  <button id="grayscale" className={filterBtn === "Grayscale" ? "active" : ""} onClick={imgFilter}>Grayscale</button>
                </div>
                <div className="slider">
                  <div className="filter_info">
                    <span className="name">{filterBtn}</span>
                    <span className="value">{sliderValue}%</span>
                  </div>
                  <input type="range" value={sliderValue} min="0" max={
                    filterBtn === "Brightness" || filterBtn === "Saturation"
                      ? "200"
                      : "100"
                  } onChange={handleSlider} />
                </div>
              </div>
              <div className="rotate">
                <label>Rotate & Flip</label>
                <div className="options">
                  <button id="left" onClick={imgRotate}><GrRotateLeft id="left" /></button>
                  <button id="right" onClick={imgRotate}><GrRotateRight id="right" /></button>
                  <button id="vertical" onClick={imgRotate}><BiReflectVertical id="vertical" /></button>
                  <button id="horizontal" onClick={imgRotate}><BiReflectHorizontal id="horizontal" /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="control">
            <div className="row">
              <input type="file" id="file_input" accept="image/*" hidden onChange={loadImg} />
              <button type="button" id="choose_img" onClick={chooseFile}>Choose Image</button>
              <button type="button" id="save_img" onClick={saveImage}>Save Image</button>
            </div>
            <button type='reset' id="reset_filter" onClick={resetFilter}>Reset Filters</button>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
