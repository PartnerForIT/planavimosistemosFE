/* eslint-disable no-useless-escape,camelcase */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import style from './CreateAccount.module.scss';
import Button from '../../Button/Button';
import UserCard from './UserCard';
import Label from '../../InputLabel';
import Input from '../../Input/Input';
import { validateEmail } from '../../../Helpers/emailValidation';
import passwordGenerator from '../../../Helpers/passwordGenerator';

const BlueRadio = withStyles({
  root: {
    color: '#ccc',
    '&$checked': {
      color: '#0085FF',
    },
  },
  checked: {},
})((props) => <Radio color='default' {...props} />);

function Third({
  user,
  previousStep,
  groups,
  places,
  skills,
  handleInput,
  security,
  setUser,
  create,
}) {
  const { t } = useTranslation();

  const [simpleInvitation, setSimpleInvitation] = useState(security.invitation ?? true);
  const {
    min_password_length, numbers, special_chars, uppercase,
  } = security;
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(false);

  // numbers
  // special_chars
  // uppercase
  // min_password_length

  const generatePass = () => {
    const password = passwordGenerator({
      length: min_password_length ?? 8,
      uppercase: uppercase ?? true,
      numbers: numbers ?? true,
      specialChars: special_chars ?? true,
    });
    setUser((prevState) => ({
      ...prevState,
      password,
    }));
  };

  const checkboxHandler = () => {
    setSimpleInvitation((prevState) => !prevState);
  };

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

  const requireError = ({
    name = '',
    message = '',

  }) => {
    const { [name]: field = '' } = user;
    if (!field.trim()) {
      setError({
        name,
        message,
      });
    } else {
      removeError({ name });
    }
  };

  const handleSubmit = () => {
    const {
      email,
    } = user;

    if (!validateEmail(email)) {
      setError({
        name: 'email',
        message: t('Email is invalid'),
      });
    } else {
      removeError({ name: 'email' });
    }

    if (!simpleInvitation) {
      requireError({
        name: 'password',
        message: t('Password is required'),
      });
    }

    //  TODO: password validation
  };

  useEffect(() => {
    if (!_.isEmpty(user) && ready) {
      create(user);
    }
  }, [create, ready, user]);

  return (
    <>
      <div className={style.thirdForm}>

        <div className={classnames(style.info, style.borderRight)}>
          <UserCard user={user} groups={groups} places={places} skills={skills} />
        </div>
        <div className={style.form}>

          <div className={style.formItem}>
            <div className={style.radio}>
              <Label text={t('User invitation mode')} htmlFor='invitation' />
              <FormControlLabel
                value='invitation'
                control={(
                  <BlueRadio
                    checked={simpleInvitation}
                    onChange={checkboxHandler}
                    value='simple'
                    name='invitation'
                    label={t('Simple')}
                    inputProps={{ 'aria-label': t('Simple') }}
                  />
                )}
                label={t('Simple')}
              />
              <FormControlLabel
                value='invitation'
                control={(
                  <BlueRadio
                    checked={!simpleInvitation}
                    onChange={checkboxHandler}
                    value='email'
                    name='invitation'
                    label={t('Invitation link via e-mail')}
                    inputProps={{ 'aria-label': t('Invitation link via e-mail') }}
                  />
                )}
                label={t('Invitation link via e-mail')}
              />
            </div>
          </div>
          {
            simpleInvitation
              ? <><Email user={user} handleInput={handleInput} errors={errors} /></>
              : (
                <>
                  <Email user={user} handleInput={handleInput} errors={errors} />
                  <div className={style.formItem}>
                    <Label htmlFor='password' text={t('Password')} />
                    <div className={style.grid}>
                      <div>
                        <Input
                          type='password'
                          name='password'
                          fullWidth
                          placeholder={t('Enter Password')}
                          value={user.password ?? ''}
                          onChange={handleInput}
                          required
                        />
                        {
                          errors.password
                          && <small>{errors.password}</small>
                        }
                      </div>
                      <Button size='big' onClick={generatePass}>{t('Generate')}</Button>
                    </div>
                  </div>
                </>
              )
          }
        </div>

      </div>
      <div className={style.buttons}>
        <Button onClick={previousStep} size='big' cancel>{t('Back')}</Button>
        <Button onClick={handleSubmit} size='big' green inverse>{t('Create and Invite')}</Button>
      </div>
    </>
  );
}

const Email = ({
  user,
  handleInput,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={style.formItem}>
        <Label htmlFor='email' text={t('Employee email')} />
        <div className={style.grid}>
          <div>
            <Input
              name='email'
              type='email'
              required
              fullWidth
              placeholder={t('User email')}
              value={user.email ?? ''}
              onChange={handleInput}
            />
            {
              errors.email
              && <small>{errors.email}</small>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Third;
