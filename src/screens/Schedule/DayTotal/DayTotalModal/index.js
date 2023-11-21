import React from 'react';
import { useTranslation } from 'react-i18next';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CloseIcon from '@material-ui/icons/Close';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';

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
}) => {
  const { t } = useTranslation();
  return (
    <ClickAwayListener onClickAway={onClose}>
      <div className={classNames(classes.dayTotalModal, 'dayTotalItemModal')}>
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
            nested && nested.map((item, index) => {
              return (
              (item.cost*1 > 0 || item.time*1 > 0) && (
                  <ModalItem
                    key={index}
                    title={item.name}
                    subTitle={item.skill_name || (item.job_type_name || `${item.employeesCount} ${t('employee')}`)}
                    cost={item.cost}
                    time={item.time}
                    night_duration={item.night_duration}
                    nested={item.children}
                    withCost={withCost}
                    main
                  />
                )
              );
            })
          }
        </Scrollbar>
      </div>
    </ClickAwayListener>
  );
}
