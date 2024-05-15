import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  memo,
} from 'react';
import { useTranslation } from 'react-i18next';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';
import moment from 'moment';

import { timeArr } from '../../../../components/Helpers/time';
import getOverflowParent from '../../../../helpers/getOverflowParent';
import Button from '../../../../components/Core/Button/Button';
import Dots from '../../../../components/Icons/Dots';
import classes from './TimeRangePicker.module.scss';

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

export default memo(({
  cellId,
  resourceId,
  value,
  onChange,
  disabled,
  withDots,
  jobTypeName,
  currentWeek,
  avatar,
  fullName,
  onDuplicateTimeToRow,
  onDuplicateTimeToColumn,
  onNotWorkToday,
  inCopyTool,
  handleCopyTool,
  handleAddHistory,
  copyTool
}) => {
  const { t } = useTranslation();
  const buttonRef = useRef(null);
  const contentBoxRef = useRef(null);
  const startScrollRef = useRef(null);
  const endScrollRef = useRef(null);

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
    [classes.timeRangeColor_copyTool]: inCopyTool,
    'timeRangeColor': true,
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

  const handleNotWork = () => {
    onNotWorkToday({ time: value, cellId });
    handleCloseModal();
  };
  const openCopyMode = () => {
    handleCloseModal();
    handleCopyTool({start: time.start, end: time.end});
  };
  const copyEvent = () => {
    handleAddHistory({resourceId: resourceId, currentWeek: currentWeek, day: cellId, start: moment(time.date).format('YYYY-MM-DD'), end: moment(time.date).format('YYYY-MM-DD')});
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
  useEffect(() => {
    if (isOpen) {
      try {
        
        let menuPlacementVertical = 'top';

        if (!inCopyTool) {
          const parentBounding = getOverflowParent(buttonRef.current).getBoundingClientRect();
          const buttonBounding = buttonRef.current.getBoundingClientRect();
          const { height: heightContent } = contentBoxRef.current.getBoundingClientRect();
          const offsetBottom = parentBounding.bottom - buttonBounding.bottom;
          menuPlacementVertical = (offsetBottom - heightContent) > 50 ? 'bottom' : 'top';
        }

        //fixes for center scroll
        if (startScrollRef.current) {
          startScrollRef.current.scrollTo(0, timeArr.findIndex(obj => obj?.code === time?.start) * 36 - 54);
        }

        //fixes for center scroll
        if (endScrollRef.current) {
          endScrollRef.current.scrollTo(0, timeArr.findIndex(obj => obj?.code === time?.end) * 36 - 54);
        }

        if (menuPlacementVertical === 'top') {
          contentBoxRef.current.classList.add(classes.timeRangeColor__modal_top);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (isOpenMenu) {
      try {
        const parentBounding = getOverflowParent(buttonRef.current).getBoundingClientRect();
        const buttonBounding = buttonRef.current.getBoundingClientRect();
        const { height: heightContent } = contentBoxRef.current.getBoundingClientRect();
        const offsetBottom = parentBounding.bottom - buttonBounding.bottom;
        const menuPlacementVertical = (offsetBottom - heightContent) > 50 ? 'bottom' : 'top';

        if (menuPlacementVertical === 'top') {
          contentBoxRef.current.classList.add(classes.timeRangeColor__modal_top);
        }
      } catch (e) {
        console.error(e);
      }
    }
    // eslint-disable-next-line
  }, [isOpen, isOpenMenu]);

  return (
    <ClickAwayListener onClickAway={handleCloseModal}>
      <div className={timeRangeColorClasses}>
        { copyTool && <span onClick={copyEvent} className={'copy-add-schedule'}>{t('Paste the Time')}</span> }
        { !value.not_work && (
          <button
            data-for={inCopyTool ? "copy-tip" : null}
            data-tip={inCopyTool ? t('Click to change time') : false}
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
          )
        }
        {
          (!disabled && withDots && !copyTool) && (
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
                      onClick={openCopyMode}
                    >
                      {t('Run Copy Mode')}
                    </button>
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
                    <button
                      className={classes.timeRangeColor__modal__item}
                      onClick={handleNotWork}
                    >
                      {value.not_work ? t('Work today') : t('Not work today')}
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
                        ref={startScrollRef}
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
                        ref={endScrollRef}
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
