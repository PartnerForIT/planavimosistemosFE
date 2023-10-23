import React, { useEffect, useState } from 'react';
import Button from '../../Button/Button';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import TimeRangePicker from '../../../../screens/Schedule/Shift/TimeRangePicker';
import DeleteIcon from '../../../Icons/DeleteIcon';

import classes from './createBreakTime.module.scss';

const initialFormValues = [];

export default function CreateBreak({
  handleClose, title, open,
  buttonTitle, createBreak, initialValues
}) {
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleCreateBreak = () => {
    createBreak(formValues)
    onClose();
  };
  const onClose = () => {
    setFormValues(initialFormValues);
    handleClose();

  };
  const addBreak = () => {
    setFormValues([
      ...formValues,
      {start: '00:00', end: '00:00'}
    ]);
  }
  const removeBreak = (index) => {
    console.log(formValues.filter((item, i) => index === i));
    setFormValues([...formValues.filter((item, i) => index !== i)]);
  }

  const handleChangeTime = (values) => {
    let newValues = [...formValues];
    newValues[values.cellId] = values.time;
    setFormValues(newValues);
  }
  useEffect(() => {
    if (initialValues) {
      setFormValues([
        ...initialValues,
      ]);
    } else {
      setFormValues([
        ...initialFormValues,
      ]);
    }
  }, [initialValues, open]);

  return (
    <Dialog onClose={onClose} open={open} PaperProps={{
      style: {
        overflow: 'visible',
      },
    }}>
      <div className={classes.createBreakTime}>
        <div className={classes.createBreakTime__title}>
          {title}
          <CloseIcon onClick={onClose} />
        </div>
        <div className={classes.createBreakTime__form}>
          <div className={classes.createBreakTime__items}>
            {formValues.map((item, idx) => (
              <div className={classes.createBreakTime__item} key={idx.toString()}>
                <TimeRangePicker
                  value={item}
                  cellId={idx}
                  onChange={handleChangeTime}
                />
                <button onClick={() => removeBreak(idx) } className={classes.createBreakTime__removeButton}>
                  <DeleteIcon
                    fill='#fd0d1b'
                    aria-hidden
                    className={classes.createBreakTime__removeIcon}
                  />
                </button>
              </div>
            ))}
          </div>
          <div onClick={addBreak} className={classes.createBreakTime__button}>+</div>
          <Button onClick={handleCreateBreak} fillWidth size='big'>
            {buttonTitle}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
