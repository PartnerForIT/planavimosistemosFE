import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, makeStyles } from '@material-ui/core';
import _ from 'lodash';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';
import avatar from '../../../Icons/avatar.png';
import Progress from '../../Progress';

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

export default function EditAccount({
  handleClose,
  title,
  open,
  employee = {},
  createJob,
  loading,
}) {
  const { t } = useTranslation();
  const styles = useStyles();

  const [user, setUser] = useState({ });

  useEffect(() => {
    if (!_.isEmpty(employee)) {
      setUser({ ...employee, ...employee.user });
    }
  }, [employee]);

  const handleInput = (e) => {
    const {
      name,
      value,
    } = e.target;

    setUser((prevState) => {
      if (prevState[name] !== 'undefined') {
        return {
          ...prevState,
          [name]: value,
        };
      }
      if (prevState.user[name] !== undefined) {
        return {
          ...prevState,
        };
      }
      return { ...prevState };
    });
  };

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
                      <Button inline inverse>{`+${t('new skill')}`}</Button>
                      <Label text={t('Skill')} htmlFor='skill' />
                      {/* TODO: change to select */}
                      <Input
                        name='skill'
                        placeholder={t('Select a skill')}
                        onChange={handleInput}
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
                      {/* TODO: change to select */}
                      <Input
                        name='group'
                        placeholder={t('Select a group')}
                        onChange={handleInput}
                      />
                    </div>

                    <div>
                      <Label htmlFor='subgroup' text={t('Assign to Subgroup')} />
                      {/* TODO: change to select */}
                      <Input
                        name='subgroup'
                        placeholder={t('Select a subgroup')}
                        onChange={handleInput}
                      />
                    </div>

                    <div>
                      <Label htmlFor='place' text={t('Assign to place')} />
                      {/* TODO: change to select */}
                      <Input
                        name='place'
                        placeholder={t('Select a place')}
                        onChange={handleInput}
                      />
                    </div>

                  </div>
                </form>
                <div className={style.buttonBlock}>
                  <Button cancel size='big'>{t('Cancel')}</Button>
                  <Button onClick={() => createJob()} size='big'>
                    {t('Save an close')}
                  </Button>
                </div>
              </>
            )
        }
      </div>
    </Dialog>
  );
}
