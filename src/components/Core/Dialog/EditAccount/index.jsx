import classnames from 'classnames';
import React, {
  useEffect, useMemo, useState, useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { DropzoneDialog } from 'material-ui-dropzone';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';
import avatar_default from '../../../Icons/avatar.png';
import Progress from '../../Progress';
import DialogCreateSkill from '../CreateSkill';
import Tooltip from '../../../Core/Tooltip';
import { createSkill } from '../../../../store/settings/actions';
import { imageResize } from '../../../Helpers';
import CurrencySign from '../../../shared/CurrencySign';
import AddEditSelectOptions from '../../../shared/AddEditSelectOptions';
import classes from './EditAccount.module.scss';
import { validateEmail } from '../../../Helpers/emailValidation';
import usePermissions from '../../usePermissions';
import InputSelect from '../../InputSelect';
import CustomSelect from '../../Select/Select';
import {Tooltip as ReactTooltip} from 'react-tooltip';
import Checkbox from '../../Checkbox/Checkbox2';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  getSchedule,
} from '../../../../store/settings/actions';
import {
  scheduleSelector,
  employeesSelector,
} from '../../../../store/settings/selectors';
import useGroupingEmployees from '../../../../hooks/useGroupingEmployees';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(11),
    height: theme.spacing(11),
    marginRight: 20,
  },
}));

const defaultSkill = {
  name: '',
  cost: '',
  earn: '',
  rates: true,
};

const childrensOpt = [
  { id: '0', name: '0' },
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: '5', name: '5' },
  { id: '6', name: '6' },
  { id: '7', name: '7' },
  { id: '8', name: '8' },
  { id: '9', name: '9' },
  { id: '10', name: '10' },
];

const permissionsConfig = [
  {
    name: 'groups',
    module: 'create_groups',
  },
  {
    name: 'places',
    module: 'create_places',
  },
  {
    name: 'cost',
    module: 'cost_earning',
  },
  {
    name: 'profit',
    module: 'profitability',
  },
  {
    name: 'schedule_shift',
    module: 'schedule_shift',
  },
  {
    name: 'time_off',
    module: 'time_off',
  },
];
export default function EditAccount({
  title,
  open,
  employee = {},
  loading,
  companyId,
  skills = [],
  groups = [],
  places = [],
  shifts = [],
  job_types = [],
  roles = [],
  onSubmit = Function.prototype,
  handleClose: externalHandleClose,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const styles = useStyles();
  const permissions = usePermissions(permissionsConfig);

  const schedule = useSelector(scheduleSelector);

  const { users: employees } = useSelector(employeesSelector);
  const [user, setUser] = useState({});
  const [skillOpen, setSkillOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [file, setFile] = useState(null);

  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState({});

  const [skillName, setSkillName] = useState(defaultSkill);

  useEffect(() => {
    dispatch(getSchedule(companyId));
  }, [dispatch, companyId]);

  const handleClose = (payload) => {
    externalHandleClose(payload);
    setTimeout(() => setUser({}), 500);
  };

  const handleSkillChange = (event) => {
    const {
      name,
      value,
    } = event.target;
    setSkillName({
      ...skillName,
      [name]: value,
    });
  };

  const handleChangeRates = () => {
    setSkillName({
      ...skillName,
      rates: !skillName.rates,
    });
  };

  const createNewSkill = (skill) => {
    dispatch(createSkill(skill, companyId));
    setSkillOpen(false);
  };

  useEffect(() => {
    if (!_.isEmpty(employee)) {
      const {
        // eslint-disable-next-line camelcase
        email,
        // eslint-disable-next-line camelcase,no-shadow
        name, surname, phone, speciality_id, external_id, hours_demand, approver_1, approver_2, effective_date, childrens, child_born_1, child_born_2, child_born_3, child_born_4, child_born_5, child_born_6, child_born_7, child_born_8, child_born_9, child_born_10, cost, charge, skills, place, shift_id, job_type_id, assign_shift_id, assign_job_type_id, role_id,
        child_born_1_disabled, child_born_2_disabled, child_born_3_disabled, child_born_4_disabled, child_born_5_disabled, child_born_6_disabled, child_born_7_disabled, child_born_8_disabled, child_born_9_disabled, child_born_10_disabled,
        // eslint-disable-next-line no-shadow
        avatar, groups, subgroups, em_status,
      } = employee;
      setUser({
        email,
        name,
        surname,
        phone,
        speciality_id,
        external_id,
        hours_demand,
        approver_1,
        approver_2,
        effective_date,
        childrens,
        child_born_1,
        child_born_2,
        child_born_3,
        child_born_4,
        child_born_5,
        child_born_6,
        child_born_7,
        child_born_8,
        child_born_9,
        child_born_10,
        child_born_1_disabled,
        child_born_2_disabled,
        child_born_3_disabled,
        child_born_4_disabled,
        child_born_5_disabled,
        child_born_6_disabled,
        child_born_7_disabled,
        child_born_8_disabled,
        child_born_9_disabled,
        child_born_10_disabled,
        shift_id,
        job_type_id,
        assign_shift_id,
        assign_job_type_id,
        role_id,
        cost,
        charge,
        avatar,
        group: Array.isArray(groups) && groups.length ? groups[0]?.id : subgroups[0]?.parent_group_id ?? '',
        subgroup: Array.isArray(subgroups) ? subgroups[0]?.id : '' ?? '',
        skill: skills?.[0]?.id ?? '',
        place: place?.[0]?.id ?? '',
        em_status: em_status ? (em_status*1).toFixed(3) : '1.00',
      });
    }
  }, [employee, groups, skills]);

  const groupsOpt = useMemo(() => {
    const grps = groups?.map(({ id, name }) => ({ id, name })) ?? [];
    return grps;
  }, [groups]);

  const skillsOptions = useMemo(() => {
    const sks = skills?.map(({ id, name }) => ({ id, name })) ?? [];
    return sks;
  }, [skills]);

  const rolesOptions = useMemo(() => {
    const rls = roles?.map(({ id, name }) => ({ id, name })) ?? [];
    return rls;
  }, [roles]);

  const subGroupsOpt = useMemo(() => {
    // eslint-disable-next-line eqeqeq
    const selectedGroup = groups.find((group) => group.id === user.group) ?? {};
    const sub = selectedGroup.subgroups?.map(({ id, name }) => ({ id, name })).slice() ?? [];
    return sub;
  }, [groups, user.group]);

  const shiftsOptions = useMemo(() => {
    const shft = shifts?.filter(e => !user.place || user.place*1 === e.place_id*1)?.map(({ id, name }) => ({ id, name })) ?? [];
    return shft;
  }, [shifts, user]);

  const jobTypesOptions = useMemo(() => {
    const jt = job_types?.filter(e => user.shift_id && e?.shifts.find(s => s.id*1 === user.shift_id*1))?.map(({ id, title }) => ({ id, name: title })) ?? [];
    return jt;
  }, [job_types, user]);

  // const assignjobTypesOptions = useMemo(() => {
  //   const jt = job_types?.filter(e => user.assign_shift_id && e?.shifts.find(s => s.id*1 === user.assign_shift_id*1))?.map(({ id, title }) => ({ id, name: title })) ?? [];
  //   return jt;
  // }, [job_types, user, shifts, t]);

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUser((prevState) => {
      switch (name) {
        case 'group': {
          const nextValues = {
            ...prevState,
            [name]: value,
          };

          // remove group
          if (!value) {
            delete nextValues.subgroup;
            delete nextValues.group;
            return nextValues;
          }

          // change or set group
          const foundGroup = groups.find(({ id }) => id === value);

          if (foundGroup.subgroups.length) {
            nextValues.subgroup = foundGroup.subgroups[0].id;
          } else {
            delete nextValues.subgroup;
          }

          return nextValues;
        }
        case 'subgroup': {
          if (value) {
            return {
              ...prevState,
              [name]: value,
            };
          }

          return prevState;
        }
        case 'place': {
          const nextValues = {
            ...prevState,
            [name]: value,
          };

          if (prevState.shift_id) {
            const foundShift = shifts.find(({ id }) => id === prevState.shift_id);
            if (foundShift && foundShift.place_id*1 !== value*1) {
              delete nextValues.shift_id;
            }
          }

          if (prevState.assign_shift_id) {
            const foundShift = shifts.find(({ id }) => id === prevState.assign_shift_id);
            if (!foundShift || foundShift.place_id*1 !== value*1) {
              delete nextValues.assign_shift_id;
            }
          }

          if (prevState.job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id*1 === nextValues?.shift_id*1)) {
              delete nextValues.job_type_id;
            }
          }

          if (prevState.assign_job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.assign_job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id*1 === nextValues?.assign_shift_id*1)) {
              delete nextValues.assign_job_type_id;
            }
          }

          return nextValues;
        }
        case 'shift_id': {
          const nextValues = {
            ...prevState,
            [name]: value,
          };

          if (prevState.job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id*1 === value*1)) {
              delete nextValues.job_type_id;
            }
          }

          return nextValues;
        }

        case 'assign_shift_id': {
          const nextValues = {
            ...prevState,
            [name]: value,
          };

          if (prevState.assign_job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.assign_job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id*1 === value*1)) {
              delete nextValues.assign_job_type_id;
            }
          }

          return nextValues;
        }

        default: {
          return {
            ...prevState,
            [name]: value,
          };
        }
      }
    });
  };

  const onEmployeesSelectChange = (selectedEmployees) => {
    const nextInputValues = { ...user, approver_1: selectedEmployees[0]?.id ?? '', approver_2: selectedEmployees[0]?.id ? user.approver_2 : '' };
    setUser(nextInputValues);
  };

  const onEmployeesSelectChange2 = (selectedEmployees) => {
    const nextInputValues = { ...user, approver_2: selectedEmployees[0]?.id ?? '' };
    setUser(nextInputValues);
  };

  const handleInputStatus = (e) => {
    const {value} = e.target;
    setUser((prevState) => {
      return {...prevState,
        em_status: value,
      }
    })
  }

  const handleBlurStatus = () => {
    let value = parseFloat(user.em_status);

    if (isNaN(value) || value < 0.001) {
      value = 0.001;
    } else if (value > 1.5) {
      value = 1.5;
    }

    setUser((prevState) => {
      return {...prevState,
        em_status: value.toFixed(3),
      }
    })
  };

  const employToCheck = useCallback(({
    id,
    name,
    surname,
  }) => {
    return {
    id,
    label: `${name} ${surname}`,
    checked: user.approver_1 === id,
  }}, [user]);

  const availableEmployees = useMemo(() => {
    return employees.filter(e => e.id !== employee?.id && e.id !== user.approver_2).map(e => e.id);
  }, [employees, employee, user]);
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => { return availableEmployees.includes(e.id) });
    // eslint-disable-next-line
  }, [employees, availableEmployees]);
  const allSortedEmployees = useGroupingEmployees(filteredEmployees, employToCheck);

  const employToCheck2 = useCallback(({
    id,
    name,
    surname,
  }) => {
    return {
    id,
    label: `${name} ${surname}`,
    checked: user.approver_2 === id,
  }}, [user]);

  const availableEmployees2 = useMemo(() => {
    return employees.filter(e => e.id !== employee?.id && e.id !== user.approver_1).map(e => e.id);
  }, [employees, employee, user]);
  const filteredEmployees2 = useMemo(() => {
    return employees.filter(e => { return availableEmployees2.includes(e.id) });
    // eslint-disable-next-line
  }, [employees, availableEmployees2]);
  const allSortedEmployees2 = useGroupingEmployees(filteredEmployees2, employToCheck2);

  useEffect(() => {
    if (file) {
      setUser((prevState) => ({ ...prevState, photo: file }));
      setFile(null);
    }
  }, [file]);

  // {
  //   skill
  //   group
  //   sub-group
  //   place
  // }

  // eslint-disable-next-line no-shadow
  const handleSave = async (file) => {
    const base64 = await imageResize(file[0]);
    setFile(base64);
    setDownloadOpen(false);
  };

  const handleSubmit = () => {
    const {
      email, group, subgroup,
    } = user;

    const setError = ({ fieldName, message }) => {
      setErrors((prevState) => ({
        ...prevState,
        [fieldName]: message,
      }));
      setReady(false);
    };

    const removeError = ({ fieldName }) => {
      setErrors((prevState) => {
        /* eslint-disable-next-line no-shadow */
        const { [fieldName]: $, ...rest } = prevState;
        return { ...rest };
      });
      setReady(true);
    };

    const requireError = ({ fieldName = '', message }) => {
      const { [fieldName]: field = '' } = user;
      if (!field.trim()) {
        setError({
          fieldName,
          message,
        });
      } else {
        removeError({ fieldName });
      }
    };

    requireError({ fieldName: 'email', message: t('Email is required') });
    requireError({ fieldName: 'name', message: t('Name is required') });
    requireError({ fieldName: 'surname', message: t('Surname is required') });

    if (group) {
      if (subGroupsOpt.length > 1 && !subgroup) {
        setError({
          fieldName: 'subgroup',
          message: t('You cant select group only if any sub-group is crated for that group'),
        });
      } else {
        removeError({ fieldName: 'subgroup' });
      }
    } else {
      removeError({ fieldName: 'subgroup' });
    }

    if (!validateEmail(email)) {
      setError({
        fieldName: 'email',
        message: t('Email is invalid'),
      });
    } else {
      removeError({ fieldName: 'email' });
    }
  };

  useEffect(() => {
    if (_.isEmpty(errors) && ready) {
      onSubmit(user);
      setReady(false);
    }
  }, [errors, onSubmit, ready, user]);

  const formClasses = classnames(style.form, {
    [style.form_three]: ((permissions.groups || permissions.places) && !permissions.time_off) || (!(permissions.groups || permissions.places) && permissions.time_off),
    [style.form_four]: (permissions.groups || permissions.places) && permissions.time_off,
    [style.form_margin]: true,
  });

  const handleExited = () => {
    setUser({});
  };
  const onClose = () => {
    handleExited();
    handleClose();
  };

  const checkAllBornsEntered = useMemo(() => {
    if (!user.childrens || user.childrens === '0') {
      return true;
    }

    const childrensCount = parseInt(user.childrens, 10);

    for (let i = 1; i <= childrensCount; i++) {
      const born = user[`child_born_${i}`];
      const disabled = user[`child_born_${i}_disabled`];

      if (!disabled && (!born || born.length === 0)) {
        return false;
      }
    }

    return true;
  }, [user.childrens, user]);

  return (
    <Dialog handleClose={onClose} onExited={handleExited} open={!!open} title={title}>
      <div className={style.edit}>

        {
          (loading || !user.name)
            ? <Progress />
            : (
              <>
                <div className={style.avatarBlock}>
                  <img src={user.avatar ?? avatar_default} className={styles.large} alt='Account logo' />
                  <Button size='big' inverse onClick={() => setDownloadOpen(true)}>{t('Upload')}</Button>
                </div>

                <form className={formClasses}>
                  <div className={classnames(style.column)}>
                    <div className={classes.formItem}>
                      <Label htmlFor='email' text={t('Email')} />
                      <Input
                        name='email'
                        type='email'
                        placeholder={t('New user email/user name')}
                        value={user.email ?? ''}
                        onChange={handleInput}
                      />
                      {
                        errors.email
                        && <small className={classes.error}>{errors.email}</small>
                      }
                    </div>

                    <div className={classes.formItem}>
                      <Label htmlFor='name' text={t('Name')} />
                      <Input
                        name='name'
                        placeholder={t('New user name')}
                        value={user.name}
                        onChange={handleInput}
                      />
                      {
                        errors.name
                        && <small className={classes.error}>{errors.name}</small>
                      }
                    </div>

                    <div className={classes.formItem}>
                      <Label htmlFor='surname' text={t('Surname')} />
                      <Input
                        name='surname'
                        placeholder={t('New user surname')}
                        value={user.surname}
                        onChange={handleInput}
                      />
                      {
                        errors.surname
                        && <small className={classes.error}>{errors.surname}</small>
                      }
                    </div>

                    <div className={classes.formItem}>
                      <Label htmlFor='external_id' text={t('External ID')} />
                      <Input
                        name='external_id'
                        placeholder={t('New user external id')}
                        value={user.external_id ?? ''}
                        onChange={handleInput}
                      />
                    </div>

                    <div className={classes.formItem}>
                      <span className={classes.labelSpan}>
                        <Label htmlFor='em_status' text={t('Employment status')} />
                        <Tooltip title={t("Employment status describes how is he employed in the company. Does he take responsability in this organization as working full time = 1.00 or half time = 0.50. Possible value in this field is from 0.01 to maximum 1.50 working time. This field also used for accumulated hours calculation in the Schedule module. By default all employees gets full time entry value - 1.00.")} />
                      </span>
                      <Input
                        name='em_status'
                        placeholder={t('Employment status')}
                        value={user.em_status ?? '1.00'}
                        onChange={handleInputStatus}
                        onBlur={handleBlurStatus}
                        step="0.001"
                        min="0.001"
                        max="1.5"
                      />
                    </div>

                  </div>

                  <div className={classnames(style.column)}>
                    
                    <div className={classes.formItem}>
                      <Label text={t('Roles')} htmlFor='roles' />
                      <AddEditSelectOptions
                        id='roles'
                        options={rolesOptions}
                        user={user}
                        name='role_id'
                        handleInput={handleInput}
                        placeholder={t('Select a roles')}
                      />
                    </div>

                    <div className={classes.formItem}>
                      <Button inline inverse onClick={() => setSkillOpen(true)}>
                        {`+${t('new skill')}`}
                      </Button>
                      <Label text={t('Skill')} htmlFor='skill' />
                      <AddEditSelectOptions
                        id='skill'
                        options={skillsOptions}
                        user={user}
                        name='skill'
                        handleInput={handleInput}
                        placeholder={t('Select a skill')}
                      />
                    </div>
                    {
                     permissions.cost && (
                       <div className={classes.formItem}>
                         <Label
                           htmlFor='cost'
                           text={(
                             <>
                               {t('Cost, Hourly rate')}
                               {' '}
                               <CurrencySign />
                             </>
                          )}
                         />
                         <Input
                           name='cost'
                           value={user.cost ?? ''}
                           placeholder={t('How much new user cost/h')}
                           onChange={handleInput}
                         />
                       </div>
                     )
                    }
                    {
                      permissions.profit && (
                        <div className={classes.formItem}>
                          <Label
                            htmlFor='charge'
                            text={(
                              <>
                                {t('Charge, Hourly rate')}
                                {' '}
                                <CurrencySign />
                              </>
                          )}
                          />
                          <Input
                            name='charge'
                            value={user.charge ?? ''}
                            placeholder={t('How much you charge per h')}
                            onChange={handleInput}
                          />
                        </div>
                      )
                    }
                    {
                     permissions.schedule_shift && schedule.use_accumulated && !schedule.accumulated_from_country && (
                       <div className={classes.formItem}>
                         <Label
                           htmlFor='hours_demand'
                           text={t('Monthly Hours Demand')}
                         />
                         <Input
                           name='hours_demand'
                           value={user.hours_demand ?? ''}
                           placeholder={t('Enter hours threshold')}
                           onChange={handleInput}
                         />
                       </div>
                     )
                    }
                  </div>

                  {
                    (permissions.places || permissions.groups) && (
                      <div
                        className={classnames(style.column)}
                      >
                        {
                          permissions.groups && (
                            <>
                              <div className={classes.formItem}>
                                <Label htmlFor='group' text={t('Assign to Group')} />
                                <InputSelect
                                  id='group'
                                  placeholder={t('Select a group')}
                                  options={groupsOpt}
                                  value={user.group}
                                  name='group'
                                  onChange={handleInput}
                                  valueKey='id'
                                  labelKey='name'
                                />
                              </div>
                              <div className={classes.formItem}>
                                <Label htmlFor='subgroup' text={t('Assign to Subgroup')} />
                                <InputSelect
                                  id='subgroup'
                                  placeholder={t('Select a subgroup')}
                                  options={subGroupsOpt}
                                  name='subgroup'
                                  onChange={handleInput}
                                  value={user.subgroup}
                                  disabled={!subGroupsOpt.length}
                                  valueKey='id'
                                  labelKey='name'
                                />
                                {
                                  errors.subgroup
                                  && <small className={classes.error}>{errors.subgroup}</small>
                                }
                              </div>
                            </>
                          )
                        }

                        {
                          permissions.places && (
                            <div className={classes.formItem}>
                              <Label htmlFor='place' text={t('Will work at this place')} />
                              <AddEditSelectOptions
                                id='place'
                                options={places}
                                user={user}
                                placeholder={t('Select a place')}
                                name='place'
                                handleInput={handleInput}
                              />
                            </div>
                          )
                        }

                        {
                          permissions.schedule_shift && (
                            <div className={classes.formItem}>
                              <span className={classes.labelSpan}>
                                <Label htmlFor='shift_id' text={t('Control and plan in the Shift')} />
                                <Tooltip title={t("First you need to select an assigned place for this employee. Secondary you can choose in which Shift inside that Place he will see and plan. This user can see all employees and also control and edit the schedule for them. It is possible to set the Job Type which he can control. In this way he will have less responsabilities. In order to edit and plan in Schedule module this user has to have a role enabled 'Manager view WEB'.")} />
                              </span>
                              <div
                                data-tooltip-id='selectdisabled'
                                data-tooltip-html={(!shiftsOptions.length || !user.place) ? t('Please select a place first') : undefined}
                              >
                                <AddEditSelectOptions
                                  id='shift_id'
                                  options={shiftsOptions}
                                  user={user}
                                  placeholder={t('Select a shift')}
                                  name='shift_id'
                                  handleInput={handleInput}
                                  disabled={!shiftsOptions.length || !user.place}
                                />
                              </div>
                            </div>
                          )
                        }

                        {
                          permissions.schedule_shift && (
                            <div className={classes.formItem}>
                              <span className={classes.labelSpan}>
                                <Label htmlFor='job_type_id' text={t('Control and plan in the Job Type')} />
                                <Tooltip title={t("In order to assign the job type as the main responsability for this person you should first select a Place and assign the Shift. Only then you can assign the Job Type of that specific Shift. This user will gain control over the users in that Job Type and he can see all the employees in Schedule module under this Job Type. In order to edit and plan in Schedule module this user has to have a role enabled 'Manager view WEB'.")} />
                              </span>
                              <div
                                data-tooltip-id='selectdisabled'
                                data-tooltip-html={(!shiftsOptions.length || !user.place) ? t('Please select a place first') : undefined}
                              >
                                <AddEditSelectOptions
                                  id='job_type_id'
                                  options={jobTypesOptions}
                                  user={user}
                                  placeholder={t('Select a job type')}
                                  name='job_type_id'
                                  handleInput={handleInput}
                                  disabled={!jobTypesOptions.length || !user.shift_id}
                                />
                              </div>
                            </div>
                          )
                        }

                      </div>
                    )
                  }
                  {
                      permissions.time_off && (
                        <div
                          className={classnames(style.column)}
                        >
                          <div className={classes.formItem}>
                            <Label text={t('Select 1st level approver')} htmlFor='approver_1' />
                            <CustomSelect
                              placeholder={t('Select 1st level approver')}
                              items={allSortedEmployees ?? []}
                              onChange={onEmployeesSelectChange}
                              width='100%'
                              fullWidth
                              choiceOfOnlyOne={true}
                              type='employees'
                              withSearch={true}
                              disabled={false}
                            />
                          </div>
                          <div className={classes.formItem}>
                            <Label text={t('Select 2nd level approver')} htmlFor='approver_2' />
                            <div
                              data-tooltip-id='selectdisabled'
                              data-tooltip-html={(!user.approver_1) ? t('Please select 1st level approver') : undefined}
                            >
                              <CustomSelect
                                placeholder={t('Select 2nd level approver')}
                                items={allSortedEmployees2 ?? []}
                                onChange={onEmployeesSelectChange2}
                                width='100%'
                                fullWidth
                                choiceOfOnlyOne={true}
                                type='employees'
                                withSearch={true}
                                disabled={!user.approver_1}
                              />
                            </div>
                          </div>
                          <div className={classes.formItem}>
                            <div className={classes.labelSpan}>
                              <Label text={t('Effective date')} htmlFor='effective_date' />
                            </div>
                            <div className={style.dateInput}>
                              <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DatePicker
                                  label={t('Effective date')}
                                  value={user.effective_date || null}
                                  onChange={(date) => handleInput({target: {name: 'effective_date', value: date.format('YYYY-MM-DD')}})}
                                  format='MMM, DD, YYYY'
                                  name="effective_date"
                                />
                              </MuiPickersUtilsProvider>
                            </div>
                          </div>
                          <div className={classes.formItem}>
                            <Label htmlFor='childrens' text={t('Number of Children')} />
                            <InputSelect
                              id='childrens'
                              placeholder={t('Number of Children')}
                              options={childrensOpt}
                              value={user.childrens}
                              name='childrens'
                              onChange={handleInput}
                              valueKey='id'
                              labelKey='name'
                            />
                          </div>
                          {
                            user.childrens && user.childrens > 0 && (
                              //inputs for each child born based on number of children
                              <div className={classes.childrenBlock}>
                                {
                                  Array.from({ length: user.childrens }, (_, index) => (
                                    <div key={index} className={classes.formItem}>
                                      <div className={classes.labelSpan}>
                                        <Label text={`${index + 1} ${t('children born')}`} htmlFor={`child_born_${index + 1}`} />
                                      </div>
                                      <div className={style.dateInput}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                          <DatePicker
                                            label={`${index + 1} ${t('children born')}`}
                                            value={user[`child_born_${index + 1}`] || null}
                                            onChange={(date) => handleInput({target: {name: `child_born_${index + 1}`, value: date.format('YYYY-MM-DD')}})}
                                            format='MMM, DD, YYYY'
                                            name={`child_born_${index + 1}`}
                                          />
                                        </MuiPickersUtilsProvider>
                                      </div>
                                      <Checkbox
                                        name={`child_born_${index + 1}_disabled`}
                                        checked={user[`child_born_${index + 1}_disabled`] || false}
                                        onChange={(e) => handleInput({target: {name: e.target.name, value: e.target.checked}})}
                                        label={t('Disabled')}
                                      />
                                    </div>
                                  ))
                                }
                              </div>
                              )
                          }   
                              
                        </div>
                      )
                    }
                </form>
                <ReactTooltip
                  id='selectdisabled'
                  className={classes.selectdisabled__tooltip}
                  effect='solid'
                  placement='bottom'
                />
                <div className={style.buttonBlock}>
                  <Button cancel size='big' onClick={handleClose}>{t('Cancel')}</Button>
                  <Button
                    onClick={handleSubmit}
                    size='big'
                    disabled={(user.assign_shift_id && !user.assign_job_type_id) || !checkAllBornsEntered}
                  >
                    {t('Save an close')}
                  </Button>
                </div>
                <DialogCreateSkill
                  open={skillOpen}
                  handleClose={() => {
                    setSkillOpen(false);
                    setSkillName(defaultSkill);
                  }}
                  handleSkillChange={handleSkillChange}
                  skillName={skillName}
                  handleChangeRates={handleChangeRates}
                  title={t('Create new skill')}
                  buttonTitle={t('Create new skill')}
                  createSkill={createNewSkill}
                  permissions={permissions}
                />
                <DropzoneDialog
                  open={downloadOpen}
                  onSave={handleSave}
                  acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                  showPreviews
                  maxFileSize={500000}
                  onClose={() => setDownloadOpen(false)}
                  filesLimit={1}
                />
              </>
            )
        }
      </div>
    </Dialog>
  );
}
