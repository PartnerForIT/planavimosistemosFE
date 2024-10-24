import React, {useState, useMemo, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '../index';
import Button from '../../Button/Button';
import classes from './NewSimpleSchedule.module.scss';
import { useParams } from 'react-router-dom';
import usePermissions from '../../usePermissions';
import { useTranslation } from 'react-i18next';
import { employeesSelector } from '../../../../store/settings/selectors';
import { jobTypesSelector } from '../../../../store/jobTypes/selectors';
import TimeRangePicker from '../../../../screens/SimpleSchedule/Shift/TimeRangePicker';
import { placesSelector } from '../../../../store/places/selectors';
import { useSelector, useDispatch } from 'react-redux';
//import { getJobTypes } from '../../../../store/jobTypes/actions';
import { getPlaces } from '../../../../store/places/actions';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import SimpleSelect from '../../SimpleSelect';
import Label from '../../InputLabel';
import Textarea from '../../Textarea/Textarea';
import Checkbox from '../../Checkbox/Checkbox2';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import moment from 'moment';

const BlueRadio = withStyles({
  root: {
    color: '#ccc',
    '&$checked': {
      color: '#0085FF',
    },
  },
  checked: {},
})((props) => <Radio color='default' {...props} />);

const permissionsConfig = [
  {
    name: 'places',
    module: 'create_places',
  },
  {
    name: 'jobs',
    module: 'create_jobs',
  },
];

export default function NewSimpleSchedule({
  handleClose, title, open, handleSubmit,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const permissions = usePermissions(permissionsConfig);
  const [formValues, setFormValues] = useState({date: moment(), duration: {start: '08:00', end: '17:00'}, reccuring: false, reccuring_settings: {type_id: 0}});
  const { users: allEmployees } = useSelector(employeesSelector);
  const allJobTypes = useSelector(jobTypesSelector);
  const allPlaces = useSelector(placesSelector);
  const { id: companyId } = useParams();

  useEffect(() => {
    //dispatch(getJobTypes(companyId));
    dispatch(getPlaces(companyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const employees = useMemo(() => allEmployees.map((empl) => {
    const {
      // eslint-disable-next-line camelcase,no-shadow
      id, name, surname
    } = empl;
    return {
      id: id,
      name: `${name} ${surname}`,
    };
  }) ?? [], [allEmployees]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextInputValues = { ...formValues, [name]: value };
    setFormValues(nextInputValues);
  };

  const handleDateChange = (date) => {
    const nextInputValues = { ...formValues, date };
    setFormValues(nextInputValues);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const nextInputValues = { ...formValues, [name]: checked };
    setFormValues(nextInputValues);
  }

  const handleChangeTime = (values) => {
    const nextInputValues = { ...formValues, duration: values.time };
    setFormValues(nextInputValues);
  }

  const handleChangeReccuring = (type_id) => {
    let repeat_every = false;
    let repeat_type = false;
    let start = false;
    if (type_id === 1) {
      repeat_every = 1;
    } else if (type_id === 2) {
      repeat_every = [];
      repeat_type = 1;
      start = 1;
    }
    const nextInputValues = { ...formValues, reccuring_settings: {type_id, repeat_every, repeat_type, start} };
    setFormValues(nextInputValues);
  }

  const handleChangeDayOfWeek = (day) => {
    const day_of_week = formValues?.reccuring_settings?.day_of_week?.includes(day) ? formValues?.reccuring_settings?.day_of_week?.filter((item) => item !== day) : (formValues?.reccuring_settings?.day_of_week ? [...formValues?.reccuring_settings?.day_of_week, day] : [day]);
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, day_of_week} };
    setFormValues(nextInputValues);
  }

  const handleChangeRepearEvery = (repeat_every) => {
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, repeat_every} };
    setFormValues(nextInputValues);
  }

  const handleChangeRepearEveryWeek = (event) => {
    const { value } = event.target;
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, repeat_every: value} };
    setFormValues(nextInputValues);
  }

  const handleChangeRepearEveryMonth = (month) => {
    const repeat_every = formValues?.reccuring_settings?.repeat_every?.includes(month) ? formValues?.reccuring_settings?.repeat_every?.filter((item) => item !== month) : (formValues?.reccuring_settings?.repeat_every ? [...formValues?.reccuring_settings?.repeat_every, month] : [month]);
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, repeat_every} };
    setFormValues(nextInputValues);
  }

  const handleRepeatTypeChange = (event) => {
    const { value } = event.target;
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, repeat_type: value*1} };
    setFormValues(nextInputValues);
  }

  const handleChangeStartMonth = (event) => {
    const { value } = event.target;
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, start: value} };
    setFormValues(nextInputValues);
  }

  const handleChangeStartMonthButton = (value) => {
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, start: value} };
    setFormValues(nextInputValues);
  }

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div>
        <div className={classes.addEntry__formControl}>
          <div className={classes.addEntry__formControl__labelBlock}>
            <Label text={t('Employee')} htmlFor='employee' />
          </div>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name='employee_id'
            fullWidth
            value={formValues.employee_id}
            options={employees}
            placeholder={t('Select employee')}
            require
            valueKey='id'
          />
        </div>
        <div className={classes.addEntry__formFlex}>
          <div className={classes.addEntry__formControl}>
            <div className={classes.addEntry__formControl__labelBlock}>
              <Label text={t('Date')} htmlFor='date' />
            </div>
            <div className={classes.addEntry__date}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  label={t('Date')}
                  value={formValues.date}
                  onChange={handleDateChange}
                  format='MMM, DD, YYYY'
                  name="date"
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
          <div className={classes.addEntry__formControl}>
            <div className={classes.addEntry__formControl__labelBlock}>
              <Label text={t('Work Duration')} htmlFor='work_duration' />
            </div>
            <TimeRangePicker
              value={formValues.duration}
              onChange={handleChangeTime}
            />
          </div>
        </div>
        <div className={classes.addEntry__formFlex}>
         {
            permissions.jobs && !!allJobTypes.length && (
              <div className={classes.addEntry__formControl}>
                <div className={classes.addEntry__formControl__labelBlock}>
                  <Label text={`${t('Job Type')} (${t('optional')})`} htmlFor='job' />
                </div>
                <SimpleSelect
                  handleInputChange={handleInputChange}
                  name='job_type_id'
                  fullWidth
                  value={formValues.job_type_id}
                  options={allJobTypes}
                  placeholder={t('Select job type')}
                  valueKey='id'
                  labelKey='title'
                />
              </div>
            )
          }
          {
            permissions.places && !!allPlaces.length && (
              <div className={classes.addEntry__formControl}>
                <div className={classes.addEntry__formControl__labelBlock}>
                  <Label text={`${'Place'} (${'optional'})`} htmlFor='place' />
                </div>
                <SimpleSelect
                  handleInputChange={handleInputChange}
                  name='place_id'
                  fullWidth
                  value={formValues.place_id}
                  options={allPlaces}
                  placeholder={t('Select place')}
                  valueKey='id'
                />
              </div>
            )
          }
        </div>
        <div className={classes.addEntry__formControl}>
          <div className={classes.addEntry__formControl__labelBlock}>
            <Label text={`${'Description'} (${t('optional')})`} htmlFor='description' />
          </div>
          <Textarea
              onChange={handleInputChange}
              name='description'
              value={formValues.description}
              wrapperClass={classes.textarea}
              rows={3}
          />
        </div>
        <div className={classes.addEntry__formCheckbox}>
          <Checkbox
            onChange={handleCheckboxChange}
            checked={formValues.reccuring}
            label={t('Reccuring')}
            name="reccuring"
          />
        </div>
        <div className={classes.addEntry__line}></div>

        { formValues.reccuring && 
          <div>
            <div className={classes.addEntry__formButtonsFlex}>
              <Button onClick={() => handleChangeReccuring(0)} inverseblack={formValues?.reccuring_settings?.type_id !== 0} size='small'>
                {t('Daily')}
              </Button>
              <Button onClick={() => handleChangeReccuring(1)} inverseblack={formValues?.reccuring_settings?.type_id !== 1} size='small'>
                {t('Weekly')}
              </Button>
              <Button onClick={() => handleChangeReccuring(2)} inverseblack={formValues?.reccuring_settings?.type_id !== 2} size='small'>
                {t('Monthly')}
              </Button>
            </div>
            <div className={classes.addEntry__sep}></div>
            
            { formValues?.reccuring_settings?.type_id === 0 &&
              <div>
                <div className={classes.addEntry__formControl}>
                  <div className={classes.addEntry__formControl__labelBlock}>
                    <Label text={t('On the day of the week')} />
                  </div>
                  <div className={classes.addEntry__formSmallButtonsFlex}>
                    {
                      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <Button key={index} onClick={() => handleChangeDayOfWeek(index)} inverseblack={!formValues?.reccuring_settings?.day_of_week?.includes(index)} size='smaller'>
                          {t(day)}
                        </Button>
                      ))
                    }
                  </div>
                </div>
                <div className={classes.addEntry__sep}></div>
                <div className={classes.addEntry__formControl}>
                  <div className={classes.addEntry__formControl__labelBlock}>
                    <Label text={t('Repear every')} />
                  </div>
                  <div className={classes.addEntry__formSmallButtonsFlex}>
                    {
                      ['Second day', 'Third day', 'Fourth day', 'Fifth day', 'Sixth day'].map((day, index) => (
                        <Button key={index} onClick={() => handleChangeRepearEvery(index+2)} inverseblack={formValues?.reccuring_settings?.repeat_every !== index+2} size='smaller'>
                          {t(day)}
                        </Button>
                      ))
                    }
                  </div>
                </div>
              </div>
            }

            { formValues?.reccuring_settings?.type_id === 1 &&
              <div>
                <div className={classes.addEntry__formControl}>
                  <div className={classes.addEntry__formControl__labelBlock}>
                    <Label text={t('Repeat every')} />
                  </div>
                  <SimpleSelect
                    handleInputChange={handleChangeRepearEveryWeek}
                    value={formValues.reccuring_settings.repeat_every}
                    options={[{id: 1, name: t('1 week')}, {id: 2, name : t('2 weeks')}, {id: 3, name: t('3 weeks')}, {id: 4, name: t('4 weeks')}]}
                    placeholder={t('Select week')}
                    valueKey='id'
                    labelKey='name'
                    className={classes.addEntry__formControl__smallSelect}
                  />
                </div>
                <div className={classes.addEntry__sep}></div>
                <div className={classes.addEntry__formControl}>
                  <div className={classes.addEntry__formControl__labelBlock}>
                    <Label text={t('On the day of the week')} />
                  </div>
                  <div className={classes.addEntry__formSmallButtonsFlex}>
                    {
                      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <Button key={index} onClick={() => handleChangeDayOfWeek(index)} inverseblack={!formValues?.reccuring_settings?.day_of_week?.includes(index)} size='smaller'>
                          {t(day)}
                        </Button>
                      ))
                    }
                  </div>
                </div>
              </div>
            }

            { formValues?.reccuring_settings?.type_id === 2 &&
              <div>
                <div className={classes.addEntry__formControl}>
                  <div className={classes.addEntry__formControl__labelBlock}>
                    <Label text={t('Repeat every')} />
                  </div>
                  <div className={classes.addEntry__formSmallButtonsFlex}>
                    {
                      ['Jan', 'Feb', 'Mar', 'May', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((day, index) => (
                        <Button key={index} onClick={() => handleChangeRepearEveryMonth(index+1)} inverseblack={!formValues?.reccuring_settings?.repeat_every?.includes(index+1)} size='smaller'>
                          {t(day)}
                        </Button>
                      ))
                    }
                  </div>
                </div>
                <div className={classes.addEntry__formControl}>
                  <div className={classes.addEntry__formControl__labelBlock}>
                    <div className={classes.addEntry__formSmallButtonsFlex}>
                      <FormControlLabel
                        value='1'
                        control={(
                          <BlueRadio
                            checked={formValues.reccuring_settings.repeat_type === 1}
                            onChange={handleRepeatTypeChange}
                            value='1'
                            name='repeat_type'
                          />
                        )}
                        label={t('On the date')}
                      />
                      <FormControlLabel
                        value='2'
                        control={(
                          <BlueRadio
                            checked={formValues.reccuring_settings.repeat_type === 2}
                            onChange={handleRepeatTypeChange}
                            value='2'
                            name='repeat_type'
                          />
                        )}
                        label={t('On the week')}
                      />
                    </div>
                  </div>
                </div>

                { formValues.reccuring_settings.repeat_type === 1 &&
                  <div>
                    <div className={classes.addEntry__formControl}>
                      <SimpleSelect
                        handleInputChange={handleChangeStartMonth}
                        value={formValues.reccuring_settings.start}
                        options={[{id: 1, name: t('1')}, {id: 2, name : t('2')}, {id: 3, name: t('3')}, {id: 4, name: t('4')}]}
                        placeholder={t('Select date')}
                        valueKey='id'
                        labelKey='name'
                        className={classes.addEntry__formControl__smallSelect}
                      />
                    </div>
                  </div>  
                }

                { formValues.reccuring_settings.repeat_type === 2 &&
                  <div>
                    <div className={classes.addEntry__formControl}>
                      <div className={classes.addEntry__formSmallButtonsFlex}>
                        {
                          ['First', 'Second', 'Third', 'Fourth', 'Fifth'].map((day, index) => (
                            <Button key={index} onClick={() => handleChangeStartMonthButton(index+1)} inverseblack={formValues?.reccuring_settings?.start !== index+1} size='smaller'>
                              {t(day)}
                            </Button>
                          ))
                        }
                      </div>
                    </div>
                    <div className={classes.addEntry__sep}></div>
                    <div className={classes.addEntry__formControl}>
                      <div className={classes.addEntry__formControl__labelBlock}>
                        <Label text={t('On the day of the week')} />
                      </div>
                      <div className={classes.addEntry__formSmallButtonsFlex}>
                        {
                          ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                            <Button key={index} onClick={() => handleChangeDayOfWeek(index)} inverseblack={!formValues?.reccuring_settings?.day_of_week?.includes(index)} size='smaller'>
                              {t(day)}
                            </Button>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }

            <div className={classes.addEntry__line}></div>
          </div>
        }
      </div>
      <div className={classes.buttonsBlock}>
        <Button onClick={() => handleClose()} inverse size='big'>
          {t('Cancel')}
        </Button>
        <Button onClick={() => handleSubmit(formValues)} disabled={!formValues.employee_id} size='big'>
          {t('Create')}
        </Button>
      </div>
    </Dialog>
  );
}
