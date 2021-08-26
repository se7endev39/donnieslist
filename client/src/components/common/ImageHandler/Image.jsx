import React, { useState } from "react";

const Image = ({ src, placeholder, ...restProps }) => {
  const [currentSrc, setSrc] = useState(src);
    const handleFailedImage = (e) => {
        console.log(e, src)
    setSrc(placeholder);
    
  };

  return <img src={currentSrc} onError={handleFailedImage} {...restProps} />;
};

export default Image;
