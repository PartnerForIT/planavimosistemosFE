import React, { useMemo, useState } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import style from './CreateAccount.module.scss';
import avatar from '../../../Icons/avatar.png';
import Button from '../../Button/Button';
import Label from '../../InputLabel';
import AddEditSelectOptions from '../../../shared/AddEditSelectOptions';
import DialogCreateSkill from '../CreateSkill';
import { createSkill } from '../../../../store/settings/actions';
import CurrencySign from '../../../shared/CurrencySign';
import Input from '../../Input/Input';
import NextStepButton from './NextStepButton';
import UserCard from './UserCard';

const defaultSkill = {
  name: '',
  cost: '',
  earn: '',
  rates: true,
};

const SecondStep = ({
  user,
  handleInput,
  nextStep,
  companyId,
  skills,
  groups,
  places,
  previousStep,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [skillName, setSkillName] = useState(defaultSkill);
  const [skillOpen, setSkillOpen] = useState(false);

  const groupsOpt = useMemo(() => {
    const grps = groups?.map(({
      id,
      name,
    }) => ({
      id,
      name,
    })) ?? [];
    return [{
      id: '',
      name: t('Select a group'),
    }, ...grps];
  }, [groups, t]);

  const handleChangeRates = () => {
    setSkillName({
      ...skillName,
      rates: !skillName.rates,
    });
  };

  const subGroupsOpt = useMemo(() => {
    // eslint-disable-next-line eqeqeq
    const selectedGroup = groups.find((group) => group.id == user.group) ?? {};
    const sub = selectedGroup.subgroups?.map(({
      id,
      name,
    }) => ({
      id,
      name,
    }))
      .slice() ?? [];
    return [{
      id: '',
      name: t('Select a sub-group'),
    }, ...sub];
  }, [groups, t, user.group]);

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

  const createNewSkill = () => {
    dispatch(createSkill(skillName, companyId));
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
    return [{
      id: '',
      name: t('Select a skill'),
    }, ...sks];
  }, [skills, t]);

  const placeOpt = useMemo(() => {
    const pls = places.map(({
      id,
      label,
    }) => ({
      id,
      name: label,
    }) ?? []);
    return [{
      id: '',
      name: t('Select a place'),
    }, ...pls];
  }, [places, t]);

  return (
    <>
      <div className={style.secondForm}>

        <div className={classnames(style.info, style.border, style.borderRight)}>
          <UserCard user={user} groups={groups} places={places} skills={skills} />
        </div>

        <div className={classnames(style.center, style.borderRight)}>
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
        </div>

        <div className={style.right}>

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
          </div>

          <div className={style.formItem}>
            <Label htmlFor='place' text={t('Assign to place')} />
            <AddEditSelectOptions
              id='place'
              options={placeOpt}
              user={user}
              placeholder={t('Select a place')}
              name='place'
              handleInput={handleInput}
            />
          </div>
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
        />
      </div>

      <div className={style.buttons}>
        <Button onClick={previousStep} size='big' cancel>{t('Back')}</Button>
        <NextStepButton onClick={nextStep} />
      </div>
    </>
  );
};

export default SecondStep;
