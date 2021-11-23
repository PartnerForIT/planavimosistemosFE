import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CloseIcon from '@material-ui/icons/Close';
import Scrollbar from 'react-scrollbars-custom';

import classes from './DayTotalModal.module.scss';
import ModalItem from './ModalItem';

const trackYProps = {
  renderer: ({ elementRef, ...props }) => (
    <span
      {...props}
      ref={elementRef}
      className={classes.scrollbarTrackY}
    />
  ),
};

export default ({
  title,
  onClose,
  nested,
  withCost,
}) => (
  <ClickAwayListener onClickAway={onClose}>
    <div className={classes.dayTotalModal}>
      <div className={classes.dayTotalModal__title}>
        {title}
      </div>
      <CloseIcon
        className={classes.dayTotalModal__close}
        onClick={onClose}
      />
      <Scrollbar
        className={classes.scrollableContent}
        noScrollX
        permanentTrackY
        trackYProps={trackYProps}
      >
        {
          nested.map((item) => (
            <ModalItem
              key={item.jobTypeId}
              title={item.name}
              subTitle={item.job_type_name || `${item.employeesCount} employee`}
              cost={item.cost}
              time={item.time}
              nested={item.children}
              withCost={withCost}
              main
            />
          ))
        }
      </Scrollbar>
    </div>
  </ClickAwayListener>
);
