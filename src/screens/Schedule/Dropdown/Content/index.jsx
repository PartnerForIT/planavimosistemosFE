import React from 'react';
import ReactDOM from 'react-dom';

import CrossIcon from '../../../../components/Icons/Cross';
import classes from './Content.module.scss';

export default ({
  children,
  offset,
  wrapperRef,
  cancel,
  onCancel,
}) => {
  const showComponent = () => {
    const style = offset ? {
      top: offset.top,
      left: offset.left + offset.width + 6,
    } : {};

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
