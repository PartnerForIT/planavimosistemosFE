import React, {
  useEffect, useMemo, useState,
} from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import style from './CreateAccount.module.scss';
import Button from '../../Button/Button';
import Label from '../../InputLabel';
import Tooltip from '../../../Core/Tooltip';
import AddEditSelectOptions from '../../../shared/AddEditSelectOptions';
import DialogCreateSkill from '../CreateSkill';
import { createSkill } from '../../../../store/settings/actions';
import CurrencySign from '../../../shared/CurrencySign';
import Input from '../../Input/Input';
import NextStepButton from './NextStepButton';
import UserCard from './UserCard';
import usePermissions from '../../usePermissions';
import {
  getSchedule,
} from '../../../../store/settings/actions';
import {
  scheduleSelector,
} from '../../../../store/settings/selectors';

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
  }, [job_types, user, shifts]);

  const assignjobTypesOptions = useMemo(() => {
    const jt = job_types?.filter(e => user.assign_shift_id && e?.shifts.find(s => s.id === user.assign_shift_id))?.map(({ id, title }) => ({ id, name: title })) ?? [];
    return jt;
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

  const containerClasses = classnames(style.secondForm, {
    [style.secondForm_three]: (permissions.create_groups || permissions.create_places),
  });
  const rowTwoClasses = classnames(style.center, {
    [style.borderRight]: (permissions.create_groups || permissions.create_places),
  });

  return (
    <>
      <div className={containerClasses}>

        <div className={classnames(style.info, style.border, style.borderRight)}>
          <UserCard user={user} groups={groups} places={places} skills={skills} />
        </div>

        <div className={rowTwoClasses}>
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
          (permissions.create_groups || permissions.create_places) && (
            <div className={style.right}>
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
                        disabled={subGroupsOpt.length <= 1}
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
                )
              }

              {
                permissions.schedule_shift && (
                  <div className={style.formItem}>
                    <span className={style.labelSpan}>
                      <Label htmlFor='job_type_id' text={t('Control and plan in the Job Type')} />
                      <Tooltip title={t("In order to assign the job type as the main responsability for this person you should first select a Place and assign the Shift. Only then you can assign the Job Type of that specific Shift. This user will gain control over the users in that Job Type and he can see all the employees in Schedule module under this Job Type. In order to edit and plan in Schedule module this user has to have a role enabled 'Manager view WEB'.")} />
                    </span>
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
                )
              }

              {
                permissions.schedule_shift && (
                  <div className={style.formItem}>
                    <span className={style.labelSpan}>
                      <Label htmlFor='assign_shift_id' text={t('Assign to Shift')} />
                      <Tooltip title={t("Quick assignation as a worker to the schedule module structure. First you have to assign to Place and then to Shift and Job type. All other changes of changing and removing from the Shift and it's Job type has to be done via Schedule module, you will not find edit here.")} />
                    </span>
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
                )
              }

              {
                permissions.schedule_shift && (
                  <div className={style.formItem}>
                    <span className={style.labelSpan}>
                      <Label htmlFor='assign_job_type_id' text={t('Assign to Job Type')} />
                      <Tooltip title={t("Assign Job Type is possible if you already selected a Place and a Shift. Choosing the right Job Type will assign the worker to the initial structure of his Scheduled work. All other changes has to be done via Schedule module. You will not find edit here in the Edit Account section.")} />
                    </span>
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
                )
              }
            </div>
          )
        }

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
      </div>

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
          disabled={user.assign_shift_id && !user.assign_job_type_id}
        />
      </div>
    </>
  );
};

export default SecondStep;
