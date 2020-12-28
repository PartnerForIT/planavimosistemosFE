import React, { useEffect } from 'react';

const FancyInput = ({ setFile, setBackgroundColor }) => {
  useEffect(() => {
    const backgroundColor = window.getComputedStyle(document.querySelector('input[disabled]'))?.backgroundColor;
    setBackgroundColor(backgroundColor);
  }, [setBackgroundColor]);

  return (
    <input
      type='file'
      onChange={(e) => {
        const fileName = e.target.files[0]?.name;
        if (fileName) {
          setFile(fileName);
        }
      }}
    />
  );
};

export default FancyInput;
