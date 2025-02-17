import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import CrossIcon from '../../../../components/Icons/Cross';
import classes from './Content.module.scss';
import classNames from "classnames";

export default ({
  children,
  offset,
  onTop,
  wrapperRef,
  cancel,
  onCancel,
  maxHeight,
  withBorder,
}) => {
  const contentClasses = classNames(classes.content, {
    [classes.content_border]: withBorder,
  });

  const [modalStyles, setModalStyles] = useState({});

  useEffect(() => {
    if (wrapperRef.current) {
      const modalHeight = wrapperRef.current.offsetHeight;

      if (onTop) {

        if (!maxHeight) {
          let marginTop = 0;
          if (offset.top - modalHeight < 0) {
            marginTop = offset.top - modalHeight - 30
          }

          setModalStyles({
            bottom: window.innerHeight - offset.top + 6 + marginTop,
            left: offset.left,
            transform: 'translateX(-50%)',
            marginLeft: '6px',
          });
        } else {
  
          const elementHeight = maxHeight || 0;
          const elementWidth = 295; // Fixed width of your window (adjust if dynamic)
          let topOffset = offset.top - elementHeight - 6; // Position above the reference element
          let leftOffset = offset.left;
  
          // Adjust if the element overflows at the top
          if (topOffset < 0) {
            topOffset = 6; // Minimum margin from the top
          }
  
          // Adjust if the element overflows on the left
          if (leftOffset - elementWidth / 2 < 0) {
            leftOffset = elementWidth / 2; // Center but prevent left overflow
          }
  
          // Adjust if the element overflows on the right
          if (leftOffset + elementWidth / 2 > window.innerWidth) {
            leftOffset = window.innerWidth - elementWidth / 2; // Prevent right overflow
          }
          
          setModalStyles({
            top: topOffset,
            left: leftOffset,
            transform: 'translateX(-50%)',
            marginLeft: '12px',
          });
        }
      } else {
        // default right
        let right = 'auto';
        let left = 'auto';

        if (offset.left + 295 > window.innerWidth) {
          right = window.innerWidth - offset.right + 18;
        } else {
          left = offset.left + offset.width + 6;
        }
  
        let top = offset.top; // Default position: below the button
  
        // If modal overflows below, position it above
        if (top + modalHeight > window.innerHeight) {
            top = offset.top - modalHeight; // Position above the button
        }
  
        // Ensure modal does not overflow the top of the viewport
        if (top < 90) {
            top = 90;
        }

        setModalStyles({
          top: top,
          left: left,
          right: right,
        });
      }
    }
  }, [offset, maxHeight, wrapperRef, onTop]);

  const showComponent = () => {

    return (
      <div
        style={modalStyles}
        ref={wrapperRef}
        className={contentClasses}
      >
        {
          cancel && (
            <button
              className={classes.content__cancel}
              onClick={onCancel}
            >
              <CrossIcon />
            </button>
          )
        }
        {children}
      </div>
    );
  };

  return (
    ReactDOM.createPortal(
      showComponent(),
      document.querySelector('#portal'),
    )
  );
};
