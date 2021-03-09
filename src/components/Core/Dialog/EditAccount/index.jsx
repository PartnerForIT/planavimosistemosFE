import classnames from 'classnames';
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { DropzoneDialog } from 'material-ui-dropzone';
import { AdminContext } from '../../MainLayout';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';
import avatar from '../../../Icons/avatar.png';
import Progress from '../../Progress';
import DialogCreateSkill from '../CreateSkill';
import { createSkill } from '../../../../store/settings/actions';
import { imageResize } from '../../../Helpers';
import CurrencySign from '../../../shared/CurrencySign';
import AddEditSelectOptions from '../../../shared/AddEditSelectOptions';
import classes from './EditAccount.module.scss';
import { validateEmail } from '../../../Helpers/emailValidation';

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
  title,
  open,
  employee = {},
  loading,
  companyId,
  skills = [],
  groups = [],
  places = [],
  onSubmit = () => ({}),
  handleClose: externalHandleClose,
  modules,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const styles = useStyles();

  const isSuperAdmin = useContext(AdminContext);

  const [user, setUser] = useState({});
  const [skillOpen, setSkillOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [file, setFile] = useState(null);

  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState({});

  const [skillName, setSkillName] = useState(defaultSkill);

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

  const createNewSkill = () => {
    dispatch(createSkill(skillName, companyId));
    setSkillOpen(false);
  };

  useEffect(() => {
    if (!_.isEmpty(employee)) {
      const {
        // eslint-disable-next-line camelcase
        email,
        // eslint-disable-next-line camelcase,no-shadow
        name, surname, phone, speciality_id, external_id, cost, charge, skills, place,
        // eslint-disable-next-line no-shadow
        photo, groups, subgroups,
      } = employee;
      setUser({
        email,
        name,
        surname,
        phone,
        speciality_id,
        external_id,
        cost,
        charge,
        photo,
        group: Array.isArray(groups) && groups.length ? groups[0]?.id : subgroups[0]?.parent_group_id ?? '',
        subgroup: Array.isArray(subgroups) ? subgroups[0]?.id : '' ?? '',
        skill: skills?.[0]?.id ?? '',
        place: place?.[0]?.id ?? '',
      });
    }
  }, [employee, groups, skills]);

  const groupsOpt = useMemo(() => {
    const grps = groups?.map(({ id, name }) => ({ id, name })) ?? [];
    return grps;
  }, [groups, t]);

  const skillsOptions = useMemo(() => {
    const sks = skills?.map(({ id, name }) => ({ id, name })) ?? [];
    return sks;
  }, [skills, t]);

  const subGroupsOpt = useMemo(() => {
    // eslint-disable-next-line eqeqeq
    const selectedGroup = groups.find((group) => group.id === parseInt(user.group, 10)) ?? {};
    const sub = selectedGroup.subgroups?.map(({ id, name }) => ({ id, name })).slice() ?? [];
    return sub;
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
    return pls;
  }, [places, t]);

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
    [style.form_three]: (!!modules.create_groups || !!modules.create_places || isSuperAdmin),
  });

  const handleExited = () => {
    setUser({});
  };

  return (
    <Dialog handleClose={handleClose} onExited={handleExited} open={!!open} title={title}>
      <div className={style.edit}>

        {
          (loading || !user.name)
            ? <Progress />
            : (
              <>
                <div className={style.avatarBlock}>
                  <img src={user.photo ?? avatar} className={styles.large} alt='Account logo' />
                  <Button size='big' inverse onClick={() => setDownloadOpen(true)}>Upload</Button>
                </div>

                <form className={formClasses}>
                  <div className={classnames(style.left, style.bordered)}>
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

                  </div>

                  <div className={style.center}>
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
                     (isSuperAdmin || !!modules.cost_earning) && (
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
                      (isSuperAdmin || !!modules.profitability) && (
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
                  </div>

                  {
                    (isSuperAdmin || !!modules.create_groups || !!modules.create_places) && (
                      <div
                        className={classnames(style.right, style.bordered)}
                      >
                        {
                          (!!modules.create_groups || isSuperAdmin) && (
                            <>
                              <div className={classes.formItem}>
                                <Label htmlFor='group' text={t('Assign to Group')} />
                                <AddEditSelectOptions
                                  id='group'
                                  options={groupsOpt}
                                  user={user}
                                  name='group'
                                  handleInput={handleInput}
                                  placeholder={t('Select a group')}
                                />
                              </div>
                              <div className={classes.formItem}>
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
                                  && <small className={classes.error}>{errors.subgroup}</small>
                                }
                              </div>
                            </>
                          )
                        }

                        {
                          (!!modules.create_places || isSuperAdmin) && (
                            <div className={classes.formItem}>
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
                          )
                        }
                      </div>
                    )
                  }
                </form>
                <div className={style.buttonBlock}>
                  <Button cancel size='big' onClick={handleClose}>{t('Cancel')}</Button>
                  <Button
                    onClick={handleSubmit}
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
                  modules={modules}
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
