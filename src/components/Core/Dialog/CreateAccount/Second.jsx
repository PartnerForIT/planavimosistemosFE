import React, {
  useEffect, useMemo, useState, useCallback,
} from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import style from './CreateAccount.module.scss';
import classes from '../Dialog.module.scss';
import Button from '../../Button/Button';
import Label from '../../InputLabel';
import Tooltip from '../../../Core/Tooltip';
import ReactTooltip from 'react-tooltip';
import AddEditSelectOptions from '../../../shared/AddEditSelectOptions';
import DialogCreateSkill from '../CreateSkill';
import { createSkill } from '../../../../store/settings/actions';
import CurrencySign from '../../../shared/CurrencySign';
import Input from '../../Input/Input';
import CustomSelect from '../../Select/Select';
import NextStepButton from './NextStepButton';
import UserCard from './UserCard';
import usePermissions from '../../usePermissions';
import InputSelect from '../../InputSelect';
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
    name: 'create_groups',
    module: 'create_groups',
  },
  {
    name: 'create_places',
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
const SecondStep = ({
  user,
  handleInput,
  nextStep,
  companyId,
  skills,
  groups,
  places,
  shifts,
  job_types,
  roles,
  previousStep,
}) => {
  
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const permissions = usePermissions(permissionsConfig);

  const schedule = useSelector(scheduleSelector);
  const { users: employees } = useSelector(employeesSelector);

  const [skillOpen, setSkillOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(getSchedule(companyId));
  }, [dispatch, companyId]);

  useEffect(() => {
    if (_.isEmpty(errors) && ready) {
      nextStep();
      setReady(false);
    }
  }, [errors, nextStep, ready]);

  const onEmployeesSelectChange = (selectedEmployees) => {
    handleInput({ target: { name: 'approver_1', value: selectedEmployees[0]?.id ?? '' } });
  };

  const onEmployeesSelectChange2 = (selectedEmployees) => {
    handleInput({ target: { name: 'approver_2', value: selectedEmployees[0]?.id ?? '' } });
  };

  const groupsOpt = useMemo(() => {
    const grps = groups?.map(({
      id,
      name,
    }) => ({
      id,
      name,
    })) ?? [];
    return grps;
  }, [groups]);
  const subGroupsOpt = useMemo(() => {
    // eslint-disable-next-line eqeqeq
    const selectedGroup = groups.find((group) => group.id === parseInt(user.group, 10)) ?? {};
    const sub = selectedGroup.subgroups?.map(({
      id,
      name,
    }) => ({
      id,
      name,
    }))
      .slice() ?? [];
    return sub;
  }, [groups, user.group]);

  const createNewSkill = (data) => {
    dispatch(createSkill(data, companyId));
    setSkillOpen(false);
  };

  const skillsOptions = useMemo(() => {
    const sks = skills?.map(({
      id,
      name,
    }) => ({
      id,
      name,
    })) ?? [];
    return sks;
    // eslint-disable-next-line
  }, [skills, t]);

  const rolesOptions = useMemo(() => {
    const rls = roles?.map(({ id, name }) => ({ id, name })) ?? [];
    return rls;
  }, [roles]);

  const shiftsOptions = useMemo(() => {
    const shft = shifts?.filter(e => !user.place || user.place === e.place_id)?.map(({ id, name }) => ({ id, name })) ?? [];
    return shft;
  }, [shifts, user]);

  const jobTypesOptions = useMemo(() => {
    const jt = job_types?.filter(e => user.shift_id && e?.shifts.find(s => s.id === user.shift_id))?.map(({ id, title }) => ({ id, name: title })) ?? [];
    return jt;
    // eslint-disable-next-line
  }, [job_types, user, shifts]);

  const assignjobTypesOptions = useMemo(() => {
    const jt = job_types?.filter(e => user.assign_shift_id && e?.shifts.find(s => s.id === user.assign_shift_id))?.map(({ id, title }) => ({ id, name: title })) ?? [];
    return jt;
    // eslint-disable-next-line
  }, [job_types, user, shifts]);

  const nextWithValidate = () => {
    const setError = ({
      name,
      message,
    }) => {
      setErrors((prevState) => ({
        ...prevState,
        [name]: message,
      }));
      setReady(false);
    };

    const removeError = ({ name }) => {
      setErrors((prevState) => {
        // eslint-disable-next-line no-shadow
        const {
          [name]: $,
          ...rest
        } = prevState;
        return {
          ...rest,
        };
      });
      setReady(true);
    };

    const { group, subgroup } = user;
    if (group) {
      if (subGroupsOpt.length > 1 && !subgroup) {
        setError({
          name: 'subgroup',
          message: t('You cant select group only if any sub-group is crated for that group'),
        });
      } else {
        removeError({ name: 'subgroup' });
      }
    } else {
      removeError({ name: 'subgroup' });
    }
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
    return employees.filter(e => e.id !== user.approver_2).map(e => e.id);
  }, [employees, user]);
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
    return employees.filter(e => e.id !== user.approver_1).map(e => e.id);
  }, [employees, user]);
  const filteredEmployees2 = useMemo(() => {
    return employees.filter(e => { return availableEmployees2.includes(e.id) });
    // eslint-disable-next-line
  }, [employees, availableEmployees2]);
  const allSortedEmployees2 = useGroupingEmployees(filteredEmployees2, employToCheck2);

  const containerClasses = classnames(style.secondForm, {
    [style.secondForm_three]: ((permissions.create_groups || permissions.create_places) && !permissions.time_off) || (!(permissions.create_groups || permissions.create_places) && permissions.time_off),
    [style.secondForm_four]: (permissions.create_groups || permissions.create_places) && permissions.time_off,
  });

  const checkAllBornsEntered = useMemo(() => {
    if (!user.childrens || user.childrens === '0') {
      return true;
    }
    const childrensCount = parseInt(user.childrens, 10);
    const enteredBorns = [
      user.child_born_1,
      user.child_born_2,
      user.child_born_3,
      user.child_born_4,
      user.child_born_5,
      user.child_born_6,
      user.child_born_7,
      user.child_born_8,
      user.child_born_9,
      user.child_born_10,
    ].slice(0, childrensCount).filter(born => born && born.length > 0).length;
    return enteredBorns === childrensCount;
  }, [user.childrens, user]);

  return (
    <>
      <div className={containerClasses}>

        <div className={classnames(style.column)}>
          <UserCard user={user} groups={groups} places={places} skills={skills} />
        </div>

        <div className={style.column}>
          <div className={classnames(style.skill, style.formItem)}>
            <Label text={t('Role')} htmlFor='role' />
            <AddEditSelectOptions
              id='role'
              options={rolesOptions}
              user={user}
              name='role_id'
              handleInput={handleInput}
            />
          </div>

          <div className={classnames(style.skill, style.formItem)}>
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
            />
          </div>
          {
            permissions.cost && (
              <div className={style.formItem}>
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
                  fullWidth
                  placeholder={t('How much new user cost/h')}
                  onChange={handleInput}
                />
              </div>
            )
          }
          {
            permissions.profit && (
              <div className={style.formItem}>
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
                  fullWidth
                  onChange={handleInput}
                />
              </div>
            )
          }
          {
            permissions.schedule_shift && schedule.use_accumulated && !schedule.accumulated_from_country && (
              <div className={style.formItem}>
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
          permissions.time_off && (
            <div className={style.column}>
              <div className={style.formItem}>
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
              <div className={style.formItem}>
                <Label text={t('Select 2nd level approver')} htmlFor='approver_2' />
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
              <div className={style.formItem}>
                <div className={style.labelSpan}>
                  <Label text={t('Effective date')} htmlFor='effective_date' />
                </div>
                <div className={classes.dateInput}>
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
              <div className={style.formItem}>
                <Label htmlFor='childrens' text={t('Number of Children')} />
                <InputSelect
                  id='childrens'
                  placeholder={t('Number of Children')}
                  value={user.childrens}
                  options={childrensOpt}
                  name='childrens'
                  onChange={handleInput}
                  valueKey='id'
                  labelKey='name'
                />
              </div>
              {
                user.childrens && user.childrens > 0 && (
                  //inputs for each child born based on number of children
                  <div className={style.childrenBlock}>
                    {
                      Array.from({ length: user.childrens }, (_, index) => (
                        <div key={index} className={style.formItem}>
                          <div className={style.labelSpan}>
                            <Label text={`${index + 1} ${t('children born')}`} htmlFor={`child_born_${index + 1}`} />
                          </div>
                          <div className={classes.dateInput}>
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
                        </div>
                      ))
                    }
                  </div>
                  )
              }   
            </div>
          )
        }

        {
          (permissions.create_groups || permissions.create_places) && (
            <div className={style.column}>
              {
                permissions.create_groups && (
                  <>
                    <div className={style.formItem}>
                      <Label htmlFor='group' text={t('Assign to Group')} />
                      <AddEditSelectOptions
                        id='group'
                        options={groupsOpt}
                        user={user}
                        name='group'
                        fullWidth
                        handleInput={handleInput}
                        placeholder={t('Select a group')}
                      />
                    </div>
                    <div className={style.formItem}>
                      <Label htmlFor='subgroup' text={t('Assign to Subgroup')} />
                      <AddEditSelectOptions
                        id='subgroup'
                        options={subGroupsOpt}
                        user={user}
                        disabled={subGroupsOpt.length <= 0}
                        name='subgroup'
                        placeholder={t('Select a subgroup')}
                        handleInput={handleInput}
                      />
                      {
                        errors.subgroup
                        && <small className={style.error}>{errors.subgroup}</small>
                      }
                    </div>
                  </>
                )
              }

              {
                permissions.create_places && (
                  <div className={style.formItem}>
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
                  <div className={style.formItem}>
                    <span className={style.labelSpan}>
                      <Label htmlFor='shift_id' text={t('Control and plan in the Shift')} />
                      <Tooltip title={t("First you need to select an assigned place for this employee. Secondary you can choose in which Shift inside that Place he will see and plan. This user can see all employees and also control and edit the schedule for them. It is possible to set the Job Type which he can control. In this way he will have less responsabilities. In order to edit and plan in Schedule module this user has to have a role enabled 'Manager view WEB'.")} />
                    </span>
                    <div
                      data-for='selectdisabled'
                      data-tip={(!shiftsOptions.length || !user.place) ? t('Please select a place first') : undefined}
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
                  <div className={style.formItem}>
                    <span className={style.labelSpan}>
                      <Label htmlFor='job_type_id' text={t('Control and plan in the Job Type')} />
                      <Tooltip title={t("In order to assign the job type as the main responsability for this person you should first select a Place and assign the Shift. Only then you can assign the Job Type of that specific Shift. This user will gain control over the users in that Job Type and he can see all the employees in Schedule module under this Job Type. In order to edit and plan in Schedule module this user has to have a role enabled 'Manager view WEB'.")} />
                    </span>
                    <div
                      data-for='selectdisabled'
                      data-tip={(!shiftsOptions.length || !user.place) ? t('Please select a place first') : undefined}
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

              {
                permissions.schedule_shift && (
                  <div className={style.formItem}>
                    <span className={style.labelSpan}>
                      <Label htmlFor='assign_shift_id' text={t('Assign to Shift')} />
                      <Tooltip title={t("Quick assignation as a worker to the schedule module structure. First you have to assign to Place and then to Shift and Job type. All other changes of changing and removing from the Shift and it's Job type has to be done via Schedule module, you will not find edit here.")} />
                    </span>
                    <div
                      data-for='selectdisabled'
                      data-tip={(!shiftsOptions.length || !user.place) ? t('Please select a place first') : undefined}
                    >
                      <AddEditSelectOptions
                        id='assign_shift_id'
                        options={shiftsOptions}
                        user={user}
                        placeholder={t('Select a shift')}
                        name='assign_shift_id'
                        handleInput={handleInput}
                        disabled={!shiftsOptions.length || !user.place}
                      />
                    </div>
                  </div>
                )
              }

              {
                permissions.schedule_shift && (
                  <div className={style.formItem}>
                    <span className={style.labelSpan}>
                      <Label htmlFor='assign_job_type_id' text={t('Assign to Job Type')} />
                      <Tooltip title={t("Assign Job Type is possible if you already selected a Place and a Shift. Choosing the right Job Type will assign the worker to the initial structure of his Scheduled work. All other changes has to be done via Schedule module. You will not find edit here in the Edit Account section.")} />
                    </span>
                    <div
                      data-for='selectdisabled'
                      data-tip={(!shiftsOptions.length || !user.place) ? t('Please select a place first') : undefined}
                    >
                      <AddEditSelectOptions
                        id='assign_job_type_id'
                        options={assignjobTypesOptions}
                        user={user}
                        placeholder={t('Select a job type')}
                        name='assign_job_type_id'
                        handleInput={handleInput}
                        disabled={!assignjobTypesOptions.length || !user.assign_shift_id}
                        wrong={user.assign_shift_id && !user.assign_job_type_id}
                      />
                    </div>
                  </div>
                )
              }
            </div>
          )
        }
      </div>

      <DialogCreateSkill
        open={skillOpen}
        handleClose={() => {
          setSkillOpen(false);
        }}
        title={t('Create new skill')}
        buttonTitle={t('Create new skill')}
        createSkill={createNewSkill}
        permissions={permissions}
      />
      <ReactTooltip
        id='selectdisabled'
        className={style.selectdisabled__tooltip}
        effect='solid'
        placement='bottom'
      />

      <div className={style.buttons}>
        <Button
          onClick={() => {
            previousStep();
            setReady(false);
          }}
          size='big'
          cancel
        >
          {t('Back')}
        </Button>
        <NextStepButton
          className={style.nextButton}
          onClick={nextWithValidate}
          disabled={(user.assign_shift_id && !user.assign_job_type_id) || !checkAllBornsEntered}
        />
      </div>
    </>
  );
};

export default SecondStep;
