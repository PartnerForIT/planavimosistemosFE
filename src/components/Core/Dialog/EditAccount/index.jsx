import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, makeStyles } from '@material-ui/core';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import NativeSelect from '@material-ui/core/NativeSelect';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';
import avatar from '../../../Icons/avatar.png';
import Progress from '../../Progress';
import DialogCreateSkill from '../CreateSkill';
import { createSkill } from '../../../../store/settings/actions';
import BootstrapInput from '../../../shared/SelectBootstrapInput';

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

export default function EditAccount({
  handleClose,
  title,
  open,
  employee = {},
  loading,
  companyId,
  skills = [],
  groups = [],
  places = [],
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const styles = useStyles();

  const [user, setUser] = useState({});
  const [skillOpen, setSkillOpen] = useState(false);

  const [skillName, setSkillName] = useState(defaultSkill);

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
  const handleCloseSkill = () => {

  };
  const createNewSkill = () => {
    dispatch(createSkill(skillName, companyId));
    setSkillOpen(false);
  };

  useEffect(() => {
    if (!_.isEmpty(employee)) {
      const {
      // eslint-disable-next-line no-shadow
        user,
        ...rest
      } = employee;
      setUser({ ...rest, ...user });
    }
  }, [employee, groups]);

  const groupsOpt = useMemo(() => {
    const grps = groups?.map(({ id, name }) => ({ id, name })) ?? [];
    return [{ id: '', name: t('Select a group') }, ...grps];
  }, [groups, t]);

  const skillsOptions = useMemo(() => {
    const sks = skills?.map(({ id, name }) => ({ id, name })) ?? [];
    return [{ id: '', name: t('Select a skill') }, ...sks];
  }, [skills, t]);

  const subGroupsOpt = useMemo(() => {
    // eslint-disable-next-line eqeqeq
    const selectedGroup = groups.find((group) => group.id == user.group) ?? {};
    const sub = selectedGroup.subgroups?.map(({ id, name }) => ({ id, name })).slice() ?? [];
    return [{ id: '', name: t('Select a sub-group') }, ...sub];
  }, [groups, t, user.group]);

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUser((prevState) => {
      if (name !== 'group') {
        return {
          ...prevState,
          [name]: value,
        };
      }
      const { subgroup: $, ...rest } = prevState;
      return {
        ...rest,
        [name]: value,
      };
    });
  };

  const placeOpt = useMemo(() => {
    const pls = places.map(({ id, label }) => ({ id, name: label }) ?? []);
    return [{ id: '', name: t('Select a place') }, ...pls];
  }, [places, t]);

  // {
  //   skill
  //   group
  //   sub-group
  //   place
  // }

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.edit}>

        {
          loading
            ? <Progress />
            : (
              <>
                <div className={style.avatarBlock}>
                  <Avatar src={user.photo ?? avatar} className={styles.large} />
                  <Button size='big' inverse>Upload</Button>
                </div>

                <form className={style.form}>
                  <div className={style.left}>
                    <div>
                      <Label htmlFor='email' text={t('Email')} />
                      <Input
                        name='email'
                        placeholder={t('New user email/user name')}
                        value={user.email ?? ''}
                        onChange={handleInput}
                      />
                    </div>

                    <div>
                      <Label htmlFor='name' text={t('Name')} />
                      <Input
                        name='name'
                        placeholder={t('New user name')}
                        value={user.name}
                        onChange={handleInput}
                      />
                    </div>

                    <div>
                      <Label htmlFor='surname' text={t('Surname')} />
                      <Input
                        name='surname'
                        placeholder={t('New user surname')}
                        value={user.surname}
                        onChange={handleInput}
                      />
                    </div>

                    <div>
                      <Label htmlFor='external_id' text={t('External ID')} />
                      <Input
                        name='external_id'
                        placeholder={t('New user external id')}
                        value={user.external_id ?? ''}
                        onChange={handleInput}
                      />
                    </div>

                  </div>

                  <div className={style.center}>
                    <div className={style.skill}>
                      <Button inline inverse onClick={() => setSkillOpen(true)}>{`+${t('new skill')}`}</Button>
                      <Label text={t('Skill')} htmlFor='skill' />
                      <Select
                        id='skill'
                        options={skillsOptions}
                        user={user}
                        name='skill'
                        handleInput={handleInput}
                      />
                    </div>

                    <div>
                      <Label htmlFor='cost' text={t('Cost, Hourly rate, $')} />
                      <Input
                        name='cost'
                        value={user.cost ?? ''}
                        placeholder={t('How much new user cost/h')}
                        onChange={handleInput}
                      />
                    </div>

                    <div>
                      <Label htmlFor='charge' text={t('Charge, Hourly rate, $')} />
                      <Input
                        name='charge'
                        value={user.charge ?? ''}
                        placeholder={t('How much you charge per h')}
                        onChange={handleInput}
                      />
                    </div>

                  </div>
                  <div className={style.right}>

                    <div>
                      <Label htmlFor='group' text={t('Assign to Group')} />
                      <Select
                        id='group'
                        options={groupsOpt}
                        user={user}
                        name='group'
                        handleInput={handleInput}
                        placeholder={t('Select a group')}
                      />
                    </div>

                    <div>
                      <Label htmlFor='subgroup' text={t('Assign to Subgroup')} />
                      <Select
                        id='subgroup'
                        options={subGroupsOpt}
                        user={user}
                        disabled={subGroupsOpt.length <= 1}
                        name='subgroup'
                        placeholder={t('Select a subgroup')}
                        handleInput={handleInput}
                      />
                    </div>

                    <div>
                      <Label htmlFor='place' text={t('Assign to place')} />
                      <Select
                        id='place'
                        options={placeOpt}
                        user={user}
                        placeholder={t('Select a place')}
                        name='place'
                        handleInput={handleInput}
                      />
                    </div>

                  </div>
                </form>
                <div className={style.buttonBlock}>
                  <Button cancel size='big' onClick={handleClose}>{t('Cancel')}</Button>
                  <Button
                    onClick={() => ({})}
                    size='big'
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
                />
              </>
            )
        }
      </div>
    </Dialog>
  );
}

const Select = ({
  id,
  user,
  name,
  options,
  handleInput,
  ...rest
}) => (
  <NativeSelect
    className={style.select}
    id={id}
    value={user[name] ?? ''}
    onChange={handleInput}
    fullWidth
    inputProps={{
      name,
    }}
    input={<BootstrapInput />}
    {...rest}
  >
    {
      options.map((opt) => (
        <option value={opt.id} key={opt.id + opt.name}>{opt.name}</option>
      ))
    }
  </NativeSelect>
);
