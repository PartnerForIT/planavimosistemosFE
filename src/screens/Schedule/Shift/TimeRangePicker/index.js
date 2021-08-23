import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';

import { timeArr } from '../../../../components/Helpers/time';
import Button from '../../../../components/Core/Button/Button';
import Dots from '../../../../components/Icons/Dots';
import classes from './TimeRangePicker.module.scss';
import getOverflowParent from '../../../../helpers/getOverflowParent';

const ButtonTime = ({
  name,
  code,
  selected,
  onClick,
}) => (
  <button
    className={classNames(classes.buttonTime, { [classes.buttonTime_selected]: selected })}
    onClick={() => onClick(code)}
  >
    {name}
  </button>
);

const trackYProps = {
  renderer: ({ elementRef, ...restProps }) => (
    <span
      {...restProps}
      ref={elementRef}
      className={classNames('trackY', classes.scrollbarTrackY)}
    />
  ),
};

export default React.memo(({
  cellId,
  value,
  onChange,
  disabled,
  withDots,
  jobTypeName,
  avatar,
  fullName,
  onDuplicateTimeToRow,
  onDuplicateTimeToColumn,
}) => {
  const { t } = useTranslation();
  const buttonRef = useRef(null);
  const contentBoxRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [time, setTime] = useState(value);

  const nightTime = useMemo(() => {
    const timeStart = value.start.split(':');
    const timeEnd = value.end.split(':');
    return (timeStart[0] * 60 + +timeStart[1]) > (timeEnd[0] * 60 + +timeEnd[1]);
  }, [value]);

  const timeRangeColorClasses = classNames(classes.timeRangeColor, {
    [classes.timeRangeColor_openMenu]: isOpenMenu,
  });

  const handleClickOpenModal = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenMenu(false);
  };
  const handleClickOpenMenu = () => {
    setIsOpenMenu((prevState) => !prevState);
  };
  const handleChangeStartTime = (start) => {
    setTime((prevState) => ({
      ...prevState,
      start,
    }));
  };
  const handleChangeFinishTime = (end) => {
    setTime((prevState) => ({
      ...prevState,
      end,
    }));
  };
  const handleCancel = () => {
    setTime(value);
    handleCloseModal();
  };
  const handleSet = () => {
    onChange({ time, cellId });
    handleCloseModal();
  };
  const handleDuplicateTimeToRow = () => {
    onDuplicateTimeToRow({ time: value, cellId });
    handleCloseModal();
  };
  const handleDuplicateTimeToColumn = () => {
    onDuplicateTimeToColumn({ time: value, cellId });
    handleCloseModal();
  };

  useEffect(() => {
    if (isOpenMenu) {
      try {
        const parentBounding = getOverflowParent(buttonRef.current).getBoundingClientRect();
        const buttonBounding = buttonRef.current.getBoundingClientRect();
        const { width: widthContent } = contentBoxRef.current.getBoundingClientRect();
        const offsetRight = parentBounding.right - buttonBounding.right;
        const menuPlacement = (offsetRight - widthContent) > 0 ? 'right' : 'left';

        if (menuPlacement === 'left') {
          contentBoxRef.current.classList.add(classes.timeRangeColor__modal_left);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpenMenu]);

  return (
    <ClickAwayListener onClickAway={handleCloseModal}>
      <div className={timeRangeColorClasses}>
        <button
          className={classes.timeRangeColor__button}
          onClick={handleClickOpenModal}
          ref={buttonRef}
          disabled={disabled}
          disabled-text={t('To change the time, you must enable the custom time')}
        >
          <span>{value.start}</span>
          <span>–</span>
          <span>{value.end}</span>
          {
            nightTime && (
              <div
                className={classes.timeRangeColor__button__nightTime}
                data-title={t('Night Time')}
              />
            )
          }
        </button>
        {
          (!disabled && withDots) && (
            <button
              className={classes.timeRangeColor__dots}
              onClick={handleClickOpenMenu}
            >
              <Dots />
            </button>
          )
        }
        {
          (isOpen || isOpenMenu) && (
            <div className={classes.timeRangeColor__modal} ref={contentBoxRef}>
              {
                isOpenMenu ? (
                  <>
                    <div className={classes.timeRangeColor__modal__user}>
                      <img
                        alt=''
                        className={classes.timeRangeColor__modal__user__avatar}
                        src={avatar}
                      />
                      <div className={classes.timeRangeColor__modal__user__info}>
                        <div className={classes.timeRangeColor__modal__user__info__fullName}>
                          {fullName}
                        </div>
                        <div className={classes.timeRangeColor__modal__user__info__jobType}>
                          {jobTypeName}
                        </div>
                      </div>
                    </div>
                    <button
                      className={classes.timeRangeColor__modal__item}
                      onClick={handleDuplicateTimeToRow}
                    >
                      {t('Duplicate the time to rows')}
                    </button>
                    <button
                      className={classes.timeRangeColor__modal__item}
                      onClick={handleDuplicateTimeToColumn}
                    >
                      {t('Duplicate the time to columns')}
                    </button>
                  </>
                ) : (
                  <>
                    <div className={classes.timeRangeColor__modal__title}>
                      {t('Set Working Time')}
                    </div>
                    <div className={classes.timeRangeColor__modal__labels}>
                      <span>
                        {t('Start')}
                      </span>
                      <span>
                        {t('Finish')}
                      </span>
                    </div>
                    <div className={classes.timeRangeColor__modal__content}>
                      <Scrollbar
                        noScrollX
                        trackYProps={trackYProps}
                      >
                        {timeArr.map((item) => (
                          <ButtonTime
                            key={`start-${item.code}`}
                            onClick={handleChangeStartTime}
                            name={item.name}
                            code={item.code}
                            selected={time.start === item.code}
                          />
                        ))}
                      </Scrollbar>
                      <Scrollbar
                        noScrollX
                        trackYProps={trackYProps}
                      >
                        {timeArr.map((item) => (
                          <ButtonTime
                            key={`end-${item.code}`}
                            onClick={handleChangeFinishTime}
                            name={item.name}
                            code={item.code}
                            selected={time.end === item.code}
                          />
                        ))}
                      </Scrollbar>
                    </div>
                    <div className={classes.timeRangeColor__modal__buttons}>
                      <Button onClick={handleCancel}>
                        {t('Cancel')}
                      </Button>
                      <Button onClick={handleSet}>
                        {t('Set')}
                      </Button>
                    </div>
                  </>
                )
              }
            </div>
          )
        }
      </div>
    </ClickAwayListener>
  );
});
