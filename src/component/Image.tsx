import React, { useState } from 'react';
import defaultImage from "@/image/book-default.png";
interface DefaultImageProps {
  src: string;
  alt: string;
  defaultSrc?: string;
  style:React.CSSProperties;
}

const Image: React.FC<DefaultImageProps> = ({ src, alt, defaultSrc = defaultImage ,style}) => {
  const [error, setError] = useState(false);

  const handleImageError = () => {
    setError(true);
  };

  return (
    <>
      {error || !src ? (
        <img style={style} src={defaultSrc} alt={alt} />
      ) : (
        <img style={style} src={src} onError={handleImageError} alt={alt} />
      )}
    </>
  );
};

export default Image;
