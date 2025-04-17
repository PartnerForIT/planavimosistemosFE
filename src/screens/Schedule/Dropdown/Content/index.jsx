import React from 'react';
import ReactDOM from 'react-dom';

import CrossIcon from '../../../../components/Icons/Cross';
import classes from './Content.module.scss';
import classNames from "classnames";

export default ({
  children,
  offset,
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

    // default right
    if (offset.left + 295 > window.innerWidth) {
      style.right = window.innerWidth - offset.right + 18;
    } else {
      style.left = offset.left + offset.width + 6;
    }

    // default bottom
    if (offset.top + maxHeight > window.innerHeight) {
      style.bottom = window.innerHeight - offset.bottom + 18;
    } else {
      style.top = offset.top + offset.height + 6;
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
      // <>
      //   <div className={classes.backdrop} onClick={onCancel} />
      //   {showComponent()}
      // </>,
      document.querySelector('#portal'),
    )
  );
};
