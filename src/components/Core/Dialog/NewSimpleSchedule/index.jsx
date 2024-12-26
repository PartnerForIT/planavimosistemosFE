import React, {useState, useMemo, useCallback, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '../index';
import Button from '../../Button/Button';
import classes from './NewSimpleSchedule.module.scss';
import { useParams } from 'react-router-dom';
import usePermissions from '../../usePermissions';
import { useTranslation } from 'react-i18next';
import { employeesSelector } from '../../../../store/settings/selectors';
import { jobTypesSelector } from '../../../../store/jobTypes/selectors';
import TimeRangePicker from '../../../../screens/SimpleSchedule/TimeRangePicker';
import { placesSelector } from '../../../../store/places/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { getJobTypes } from '../../../../store/jobTypes/actions';
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
import Input from '../../Input/Input';
import CustomSelect from '../../Select/Select';

import useGroupingEmployees from '../../../../hooks/useGroupingEmployees';

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

const initialFormValues = {
  date: moment(), title: '', duration: {start: '08:00', end: '17:00'}, reccuring: false, reccuring_settings: {type_id: 0, repeat_type: 1},
};

export default function NewSimpleSchedule({
  handleClose, title, open, handleSubmit, editData, availableEmployees
}) {
  
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const permissions = usePermissions(permissionsConfig);
  const [formValues, setFormValues] = useState(initialFormValues);
  const { users: employees } = useSelector(employeesSelector);
  const allJobTypes = useSelector(jobTypesSelector);
  const allPlaces = useSelector(placesSelector);
  const { id: companyId } = useParams();
  // eslint-disable-next-line
  const [daysSelect, setDaysSelect] = useState([{id: 1, name: t('1')}, {id: 2, name : t('2')}, {id: 3, name: t('3')}, {id: 4, name: t('4')}, {id: 5, name: t('5')}, {id: 6, name: t('6')}, {id: 7, name: t('7')}, {id: 8, name: t('8')}, {id: 9, name: t('9')}, {id: 10, name: t('10')}, {id: 11, name: t('11')}, {id: 12, name: t('12')}, {id: 13, name: t('13')}, {id: 14, name: t('14')}, {id: 15, name: t('15')}, {id: 16, name: t('16')}, {id: 17, name: t('17')}, {id: 18, name: t('18')}, {id: 19, name: t('19')}, {id: 20, name: t('20')}, {id: 21, name: t('21')}, {id: 22, name: t('22')}, {id: 23, name: t('23')}, {id: 24, name: t('24')}, {id: 25, name: t('25')}, {id: 26, name: t('26')}, {id: 27, name: t('27')}, {id: 28, name: t('28')}, {id: 29, name: t('29')}, {id: 30, name: t('30')}, {id: 31, name: t('31')}]);

  useEffect(() => {
    dispatch(getJobTypes(companyId));
    dispatch(getPlaces(companyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  useEffect(() => {
    if (editData) {
      const {
        date,
        job_type_id,
        place_id,
        title,
        description,
        employee_id,
        reccuring,
        reccuring_end,
        start_work,
        end_work,
        setting,
      } = editData;

      const reccuring_settings = setting?.reccuring_settings ? setting.reccuring_settings : {};

      let repeat_every = false;
      let repeat_type = false;
      let start = false;
      if (reccuring_settings?.type_id === 0) {
        repeat_type = 1;
      } else if (reccuring_settings?.type_id === 1) {
        repeat_every = 1;
      } else if (reccuring_settings?.type_id === 2) {
        repeat_every = [];
        repeat_type = 1;
        start = [];
        if (reccuring_settings?.start) {
          setDaysSelect([
            ...daysSelect.map((item) => {
              return {
                ...item,
                checked: reccuring_settings.start.includes(item.id),
              }
            })
          ]);

        }
      }

      setFormValues({
          ...formValues,
          date: date ? moment(date, 'YYYY-MM-DD') : null,
          duration: {
            start: start_work ? moment(start_work, 'HH:mm:ss').format('HH:mm') : initialFormValues.duration.start,
            end: end_work ? moment(end_work, 'HH:mm:ss').format('HH:mm') : initialFormValues.duration.end,
          },
          job_type_id: job_type_id ? job_type_id : '',
          place_id: place_id ? place_id : '',
          title: title ? title : '',
          description : description ? description : '',
          employees: employee_id ? [{id: employee_id, checked: true}] : [],
          reccuring: reccuring ? true : false,
          reccuring_end: reccuring_end ? moment(reccuring_end, 'YYYY-MM-DD') : null,
          reccuring_settings: {
            type_id: reccuring_settings?.type_id ? reccuring_settings.type_id : 0,
            repeat_type: reccuring_settings?.repeat_type ? reccuring_settings.repeat_type : repeat_type,
            repeat_every: reccuring_settings?.repeat_every ? reccuring_settings.repeat_every : repeat_every,
            start: reccuring_settings?.start ? reccuring_settings.start : start,
            day_of_week: reccuring_settings?.day_of_week ? reccuring_settings.day_of_week : [],
          },
      });
    } else {
      setFormValues(initialFormValues);
    }

    // eslint-disable-next-line
  }, [editData]);

  const employToCheck = useCallback(({
      id,
      name,
      surname,
    }) => ({
      id,
      label: `${name} ${surname}`,
      checked: formValues.employees?.some(({id: employee_id}) => employee_id === id),

    }), [formValues]);
    const filteredEmployees = useMemo(() => {
      return employees.filter(e => { return availableEmployees.includes(e.id) });
      // eslint-disable-next-line
    }, [employees, availableEmployees]);
    const allSortedEmployees = useGroupingEmployees(filteredEmployees, employToCheck);

  const handleOnSubmit = () => {
    handleSubmit(formValues);
    setFormValues(initialFormValues);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextInputValues = { ...formValues, [name]: value };
    setFormValues(nextInputValues);
  };

  const handleDateChange = (date) => {
    const nextInputValues = { ...formValues, date };
    setFormValues(nextInputValues);
  };

  const handleEndDateChange = (date) => {
    const nextInputValues = { ...formValues, reccuring_end: date };
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
    if (type_id === 0) {
      repeat_type = 1;
    } else if (type_id === 1) {
      repeat_every = 1;
    } else if (type_id === 2) {
      repeat_every = [];
      repeat_type = 1;
      start = [];
    }
    const nextInputValues = { ...formValues, reccuring_settings: {type_id, repeat_every, repeat_type, start} };
    setFormValues(nextInputValues);
  }

  const handleChangeDayOfWeek = (day) => {
    const day_of_week = formValues?.reccuring_settings?.day_of_week?.includes(day) ? formValues?.reccuring_settings?.day_of_week?.filter((item) => item !== day) : (formValues?.reccuring_settings?.day_of_week ? [...formValues?.reccuring_settings?.day_of_week, day] : [day]);
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, day_of_week} };
    setFormValues(nextInputValues);
  }

  const handleChangeRepeatEvery = (repeat_every) => {
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, repeat_every} };
    setFormValues(nextInputValues);
  }

  const handleChangeRepeatEveryWeek = (event) => {
    const { value } = event.target;
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, repeat_every: value} };
    setFormValues(nextInputValues);
  }

  const handleChangeRepeatEveryMonth = (month) => {
    const repeat_every = formValues?.reccuring_settings?.repeat_every?.includes(month) ? formValues?.reccuring_settings?.repeat_every?.filter((item) => item !== month) : (formValues?.reccuring_settings?.repeat_every ? [...formValues?.reccuring_settings?.repeat_every, month] : [month]);
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, repeat_every} };
    setFormValues(nextInputValues);
  }

  const handleRepeatTypeChange = (event) => {
    const { value } = event.target;
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, repeat_type: value*1} };
    setFormValues(nextInputValues);
  }

  const handleChangeStartMonth = (value) => {
    const arrChecked = value?.filter((i) => i.checked);
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, start: arrChecked.map(i => i.id)} };
    setFormValues(nextInputValues);
  }

  const handleChangeStartMonthButton = (value) => {
    const start = formValues?.reccuring_settings?.start?.includes(value) ? formValues?.reccuring_settings?.start?.filter((item) => item !== value) : (formValues?.reccuring_settings?.start ? [...formValues?.reccuring_settings?.start, value] : [value]);
    const nextInputValues = { ...formValues, reccuring_settings: {...formValues.reccuring_settings, start} };
    setFormValues(nextInputValues);
  }

  const onEmployeesSelectChange = (selectedEmployees) => {
    const nextInputValues = { ...formValues, employees: selectedEmployees };
    setFormValues(nextInputValues);
  };

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div>
        <div className={classes.addEntry__formControl}>
          <div className={classes.addEntry__formControl__labelBlock}>
            <Label text={t('Employee')} htmlFor='employee' />
          </div>
          <CustomSelect
            placeholder={t('Select employee')}
            items={allSortedEmployees ?? []}
            onChange={onEmployeesSelectChange}
            width='100%'
            fullWidth
            type='employees'
            withSearch={true}
            confirmButton={t('Select')}
          />
        </div>
        <div className={classes.addEntry__formControl}>
          <div className={classes.addEntry__formControl__labelBlock}>
            <Label text={t('Title')} htmlFor='title' />
          </div>
          <Input
            type='text'
            value={formValues.title}
            onChange={handleInputChange}
            name='title'
            fullWidth
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
        <div className={classes.addEntry__formFlex}>
          <div className={classes.addEntry__formCheckbox}>
            <Checkbox
              onChange={handleCheckboxChange}
              checked={formValues.reccuring}
              label={t('Reccuring')}
              name="reccuring"
            />
          </div>
          { formValues.reccuring && (
            <div className={classes.addEntry__formControl}>
              <div className={classes.addEntry__formControl__labelBlock}>
                <Label text={t('End date')} htmlFor='reccuring_end' />
              </div>
              <div className={classes.addEntry__date}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    label={t('End date')}
                    value={formValues.reccuring_end}
                    onChange={handleEndDateChange}
                    format='MMM, DD, YYYY'
                    name="reccuring_end"
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
          )}
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
                      label={t('Repeat every day(s)')}
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
                      label={t('Repeat every')}
                    />
                  </div>
                </div>

                { formValues.reccuring_settings.repeat_type === 1 &&
                  <div className={classes.addEntry__formControl}>
                    <div className={classes.addEntry__formSmallButtonsFlex}>
                      {
                        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                          <Button key={index+1} onClick={() => handleChangeDayOfWeek(index+1)} inverseblack={!formValues?.reccuring_settings?.day_of_week?.includes(index+1)} size='smaller'>
                            {t(day)}
                          </Button>
                        ))
                      }
                    </div>
                  </div>
                }
                
                { formValues.reccuring_settings.repeat_type === 2 &&
                  <div className={classes.addEntry__formControl}>
                    <div className={classes.addEntry__formSmallButtonsFlex}>
                      <Input
                        type='number'
                        value={formValues.reccuring_settings.repeat_every}
                        onChange={(e) => handleChangeRepeatEvery(e.target.value)}
                        className={classes.addEntry__formControl__smallInput}
                      />
                    </div>
                  </div>
                }
              </div>
            }

            { formValues?.reccuring_settings?.type_id === 1 &&
              <div>
                <div className={classes.addEntry__formControl}>
                  <div className={classes.addEntry__formControl__labelBlock}>
                    <Label text={t('Repeat every')} />
                  </div>
                  <SimpleSelect
                    handleInputChange={handleChangeRepeatEveryWeek}
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
                        <Button key={index+1} onClick={() => handleChangeDayOfWeek(index+1)} inverseblack={!formValues?.reccuring_settings?.day_of_week?.includes(index+1)} size='smaller'>
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
                        <Button key={index} onClick={() => handleChangeRepeatEveryMonth(index+1)} inverseblack={!formValues?.reccuring_settings?.repeat_every?.includes(index+1)} size='smaller'>
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
                      <CustomSelect
                        placeholder={t('Select date')}
                        buttonLabel={t('Select')}
                        items={daysSelect}
                        onChange={handleChangeStartMonth}
                        width='auto'
                        withSearch={false}
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
                            <Button key={index+1} onClick={() => handleChangeStartMonthButton(index+1)} inverseblack={!formValues?.reccuring_settings?.start?.includes(index+1)} size='smaller'>
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
                            <Button key={index+1} onClick={() => handleChangeDayOfWeek(index+1)} inverseblack={!formValues?.reccuring_settings?.day_of_week?.includes(index+1)} size='smaller'>
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
        <Button onClick={() => handleOnSubmit()} disabled={!formValues.employees?.length || !formValues.title} size='big'>
          {t('Create')}
        </Button>
      </div>
    </Dialog>
  );
}
