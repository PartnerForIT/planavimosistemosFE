import React, { useEffect, useState } from 'react';
import Button from '../../Button/Button';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '../../../Core/Checkbox/Checkbox2';
import SimpleSelect from '../../../Core/SimpleSelect';
import { timeArr } from '../../../Helpers/time';
import { useTranslation } from 'react-i18next';

import classes from './workTime.module.scss';

const initialFormValues = {
  monday: {checked: false, start: '08:00', finish: '17:00'},
  tuesday: {checked: false, start: '08:00', finish: '17:00'},
  wednesday: {checked: false, start: '08:00', finish: '17:00'},
  thursday: {checked: false, start: '08:00', finish: '17:00'},
  friday: {checked: false, start: '08:00', finish: '17:00'},
  saturday: {checked: false, start: '08:00', finish: '17:00'},
  sunday: {checked: false, start: '08:00', finish: '17:00'},
};

export default function WorkTime({
  handleClose, title, open,
  buttonTitle, editWorkTime, initialValues
}) {

  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleWorkTime = () => {
    editWorkTime(formValues)
    onClose();
  };

  const onClose = () => {
    setFormValues(initialFormValues);
    handleClose();

  };

  const handleChangeStartTime = (event, type) => {
    const { name, value } = event.target;
    if (value) {
      setFormValues({
        ...formValues,
        [name]: {
          ...formValues[name],
          [type]: value,
        },
      });
    }
  };

  const handleChangeDays = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: {
        ...formValues[event.target.name],
        checked: event.target.checked,
      },
    });
  };

  useEffect(() => {
    if (initialValues.work_time) {
      setFormValues({
        ...initialFormValues,
        ...initialValues.work_time,
      });
    } else {
      setFormValues({
        ...initialFormValues,
      });
    }
  }, [initialValues, open]);

  return (
    <Dialog onClose={onClose} open={open} PaperProps={{
      style: {
        overflow: 'visible',
      },
    }}>
      <div className={classes.workTime}>
        <div className={classes.workTime__title}>
          {title}
          <CloseIcon onClick={onClose} />
        </div>
        <div className={classes.workTime__form}>
          <div className={classes.workingTime}>
            
            {Object.keys(formValues).map((item, index) => (
              <div key={item + index.toString()} className={classes.workigTime__inner}>
                <Checkbox
                  onChange={handleChangeDays}
                  checked={formValues[item].checked}
                  label={t(`${item}`)}
                  name={`${item}`}
                />
                <SimpleSelect
                  handleInputChange={(event) => { handleChangeStartTime(event, 'start') }}
                  name={`${item}`}
                  fullWidth
                  value={formValues[item].start}
                  options={timeArr}
                  readOnly={!formValues[item].checked}
                  withoutSearch
                />
                <div className={classes.workigTime__to}>{t('To')}</div>
                <SimpleSelect
                  handleInputChange={(event) => { handleChangeStartTime(event, 'finish') }}
                  name={`${item}`}
                  fullWidth
                  value={formValues[item].finish}
                  options={timeArr}
                  readOnly={!formValues[item].checked}
                  withoutSearch
                />
              </div>
            ))}

            
          </div>
          <Button onClick={handleWorkTime} size='big' className={classes.workTime__button}>
            {buttonTitle}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
