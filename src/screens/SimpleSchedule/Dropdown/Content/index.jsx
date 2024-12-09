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
      style.bottom = window.innerHeight - offset.top + 6;
      style.left = offset.left;
      style.transform = 'translateX(-50%)';
      style.marginLeft = '12px';
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

        if (offset.top - maxHeight < 0) {
          style.bottom = 0;
        }
      } else {
        style.top = offset.top + offset.height;
      }
    }


    // style.top = offset.top;

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
