import React from 'react';
import ReactDOM from 'react-dom';

import CrossIcon from '../../../../components/Icons/Cross';
import classes from './Content.module.scss';

const height = 421;
export default ({
  children,
  offset,
  wrapperRef,
  cancel,
  onCancel,
}) => {
  const showComponent = () => {
    const style = {};

    // default right
    if (offset.left + 295 > window.innerWidth) {
      style.right = window.innerWidth - offset.right + 18;
    } else {
      style.left = offset.left + offset.width + 6;
    }

    // default bottom
    if (offset.top + height > window.innerHeight) {
      style.bottom = window.innerHeight - offset.bottom + 18;
    } else {
      style.top = offset.top + offset.height + 6;
    }

    // style.top = offset.top;

    return (
      <div
        style={style}
        ref={wrapperRef}
        className={classes.content}
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
