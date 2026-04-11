import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
// import './index.css';
// import App from './App';

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <>
      <StarRating maxRating={10} color="blue" onSetRating={setMovieRating} />
      <div>
        <p>This movie has rating {movieRating}</p>
      </div>
    </>
  );
}

export default Test;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating
      maxRating={5}
      messages={["Poor", "Fair", "Good", "Very Good", "Excellent"]}
    />
    <Test />
  </React.StrictMode>,
);
