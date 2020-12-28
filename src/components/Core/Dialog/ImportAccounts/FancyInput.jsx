import React, { useEffect } from 'react';
import { CSVReader } from 'react-papaparse';

const FancyInput = ({ setFileName, setBackgroundColor, setFile }) => {
  useEffect(() => {
    const backgroundColor = window.getComputedStyle(document.querySelector('input[disabled]'))?.backgroundColor;
    setBackgroundColor(backgroundColor);
  }, [setBackgroundColor]);

  return (
    <>
      <input
        type='file'
        onChange={(e) => {
          const fileName = e.target.files[0]?.name;
          if (fileName) {
            setFile(e.target.files[0]);
            setFileName(fileName);
          }
        }}
      />
      <CSVReader
        noDrag
        onDrop={(data, file1) => {
          setFile(data);
          setFileName(file1.name);
        }}
        noProgressBar
        style={{
          dropArea: {
            position: 'absolute',
            borderColor: 'transparent',
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            padding: 0,
          },
          dropAreaActive: {
            borderColor: 'red',
          },
          dropFile: {
            display: 'none',
          },
          fileSizeInfo: {
            display: 'none',
          },
          fileNameInfo: {
            display: 'none',
          },
          removeButton: {
            color: 'blue',
          },
          progressBar: {
            backgroundColor: 'pink',
          },

        }}
      />
    </>
  );
};

export default FancyInput;
