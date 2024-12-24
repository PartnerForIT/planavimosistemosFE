import React from 'react';
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

  const showComponent = () => {
    const style = {};

    if (onTop) {

      if (!maxHeight) {
        style.bottom = window.innerHeight - offset.top + 6;
        style.left = offset.left;
        style.transform = 'translateX(-50%)';
        style.marginLeft = '12px';
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
        
        style.top = `${topOffset}px`;
        style.left = `${leftOffset}px`;
        style.transform = 'translateX(-50%)';
        style.marginLeft = '12px';
      }
    } else {
      // default right
      if (offset.left + 295 > window.innerWidth) {
        style.right = window.innerWidth - offset.right + 18;
      } else {
        style.left = offset.left + offset.width + 6;
      }

      // default bottom
      if (offset.top + maxHeight > window.innerHeight) {
        style.bottom = window.innerHeight - offset.bottom;
      } else {
        style.top = offset.top + offset.height;
      }
    }

    return (
      <div
        style={style}
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
