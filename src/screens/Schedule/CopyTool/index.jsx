import React, {forwardRef, useRef, useState, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import Tooltip from 'react-tooltip';
import moment from 'moment';

import TimeRangePicker from '../Shift/TimeRangePicker';
import classes from './CopyTool.module.scss';
import {useDispatch, useSelector} from "react-redux";
import { copyToolHistorySelector, copyToolRollbackSelector } from '../../../store/copyTool/selectors';

import { addToHistory, removeHistory, backHistory, forwardHistory, addTimelines } from '../../../store/copyTool/actions';
import { setLoader } from '../../../store/schedule/actions';

export default forwardRef(({
  start,
  end,
  getBodyForGetSchedule,
  onClose,
}, ref) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id: companyId } = useParams();
  const cont = useRef();

  useImperativeHandle(ref, () => ({
    addHistory: (data) => {
      dispatch(addToHistory({...data, start: data.start+' '+time.start+':00', end: data.end+' '+time.end+':00'}));
    },
  }));

  const [time, setTime] = useState({
    start: moment(start).format('HH:mm'),
    end: moment(end).format('HH:mm'),
  });
  let dragStart = { x: 0, y: 0 };
  let current = { x: 530, y: 200 };

  const history = useSelector(copyToolHistorySelector);
  const rollback = useSelector(copyToolRollbackSelector);

  const handleDragStart = (e) => {
    const offsetX = e.clientX - current.x;
    const offsetY = e.clientY - current.y;
    dragStart = { x: offsetX, y: offsetY };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const offsetX = e.clientX - dragStart.x;
    const offsetY = e.clientY - dragStart.y;
    cont.current.style.left = offsetX + 'px';
    cont.current.style.top = offsetY + 'px';
    current = { x: offsetX, y: offsetY };
  };

  const handleChangeTime = (values) => {
    setTime(values.time);
  };

  const handleBack = () => {
    dispatch(backHistory());
  }

  const handleForward = () => {
    dispatch(forwardHistory());
  }

  const handleDeleteChanges = () => {
    dispatch(removeHistory());
  }
  const handleSave = () => {
    dispatch(setLoader());
    dispatch(addTimelines({
      companyId,
      data: history,
      body: getBodyForGetSchedule(),
    }));
    handleDeleteChanges();
    onClose();
  }
  
  const containerClasses = classNames(classes.copyTool, {
    
  });
  
  const [tooltipHint, setTooltipHint] = useState(true);

  
  return (
    <>
      <div className={classes.copyTool_overflow_top}></div>
      <div
        ref={cont}
        className={containerClasses}
        style={{
          left: '530px',
          top: '200px',
        }}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        { tooltipHint && (
          <div className={classes.copyTool_tooltip}>
            <div className={classes.copyTool_tooltip_inner}>
              {t('Click on cell to paste the selected time')}
              <span
                className={classes.copyTool_tooltip_close}
                onClick={() => setTooltipHint(false)}></span>
            </div>
          </div>
          )
        }
        <div className={classes.copyTool_container}>
          <TimeRangePicker
            className={classes.copyTool_time}
            value={time}
            inCopyTool={true}
            onChange={handleChangeTime}
          />
          <div className={classes.copyTool_btns}>
            <button
              className={classes.copyTool_btn + ' ' + classes.copyTool_btn_back}
              data-for="tip"
              data-tip={t('Step Back')}
              disabled={history.length === 0}
              onClick={handleBack}
            />
            <button
              className={classes.copyTool_btn + ' ' + classes.copyTool_btn_forward}
              data-for="tip"
              data-tip={t('Step Forward')}
              disabled={rollback.length === 0}
              onClick={handleForward}
            />
            <button
              className={classes.copyTool_btn + ' ' + classes.copyTool_btn_delete}
              data-for="tip"
              data-tip={t('Delete Changes')}
              disabled={history.length === 0}
              onClick={handleDeleteChanges}
            />
          </div>
          <button
            className={classes.copyTool_btn}
            onClick={handleSave}
          >{t('Save & Exit')}</button>
        </div>
        <Tooltip
          id="tip"
          className={classes.copyTool_tip}
          effect='solid'
        />
      </div>
    </>
  );
});
