import React from "react";

const CardBody = ({product, toggle, change}) => {   
    let style= "btn btn-primary"
    let text = "START"
    if (toggle) {
        style = "btn btn-danger"
        text = "STOP"
    }
  return (
    <div className="card-body">
      <p className="card-text">Product Count: {product}</p>      
      <button className={style} onClick={change}>
        {text}
      </button>{" "}      
    </div>
  );
}

export default CardBody;