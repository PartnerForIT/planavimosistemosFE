import React, { useEffect, useState } from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import classnames from 'classnames';
import style from './CreateAccount.module.scss';
import avatar from '../../../Icons/avatar.png';
import Button from '../../Button/Button';
import { convertBase64 } from '../../../Helpers';
import Label from '../../InputLabel';
import Input from '../../Input/Input';
import NextStepButton from './NextStepButton';
import { validateEmail } from '../../../Helpers/emailValidation';

const FirstStep = ({
  user,
  handleInput,
  nextStep,
  setUser,
}) => {
  const [file, setFile] = useState(null);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line no-shadow
  const handleSave = async (file) => {
    const base64 = await convertBase64(file[0]);
    setFile(base64);
    setUploadVisible(false);
  };

  const [errors, setErrors] = useState({});

  const { t } = useTranslation();

  useEffect(() => {
    if (file) {
      setUser((prevState) => ({ ...prevState, photo: file }));
    }
  }, [file, setUser]);

  const nextWithValidate = () => {
    const { email } = user;

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
      message,
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

    requireError({
      name: 'email',
      message: t('Email is required'),
    });
    requireError({
      name: 'name',
      message: t('Name is required'),
    });
    requireError({
      name: 'surname',
      message: t('Surname is required'),
    });

    if (!validateEmail(email)) {
      setError({
        name: 'email',
        message: t('Email is invalid'),
      });
    } else {
      removeError({ name: 'email' });
    }

    if (_.isEmpty(errors) && ready) {
      nextStep();
    }
  };

  useEffect(() => {
    if (_.isEmpty(errors) && ready) {
      nextStep();
    }
  }, [errors, nextStep, ready]);
  return (
    <>
      <div className={style.firstForm}>
        <div className={classnames(style.info, style.borderRight)}>
          <div className={style.avatar_block}>
            <div className={style.avatar_block_inner}>
              <img className={style.avatar} src={user.photo || avatar} alt={t('avatar')} />
              <Button inverse fillWidth onClick={() => setUploadVisible(true)}>Upload</Button>
            </div>
            <DropzoneDialog
              open={uploadVisible}
              onSave={handleSave}
              acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
              showPreviews
              maxFileSize={500000}
              onClose={() => setUploadVisible(false)}
              filesLimit={1}
            />
          </div>
        </div>
        <div className={style.form}>
          <form>

            <div className={style.formItem}>
              <Label htmlFor='email' text={t('Email')} />
              <Input
                name='email'
                type='email'
                required
                placeholder={t('New user email/user name')}
                value={user.email ?? ''}
                onChange={handleInput}
              />
              {
                errors.email
                && <small>{errors.email}</small>
              }
            </div>

            <div className={style.formItem}>
              <Label htmlFor='name' text={t('Name')} />
              <Input
                name='name'
                placeholder={t('New user name')}
                value={user.name}
                onChange={handleInput}
              />
              {
                errors.name
                && <small>{errors.name}</small>
              }
            </div>

            <div className={style.formItem}>
              <Label htmlFor='surname' text={t('Surname')} />
              <Input
                name='surname'
                placeholder={t('New user surname')}
                value={user.surname}
                onChange={handleInput}
              />
              {
                errors.surname
                && <small>{errors.surname}</small>
              }
            </div>

            <div className={style.formItem}>
              <Label htmlFor='external_id' text={t('External ID')} />
              <Input
                name='external_id'
                placeholder={t('New user external id')}
                value={user.external_id ?? ''}
                onChange={handleInput}
              />
            </div>

          </form>
        </div>
      </div>
      <div className={style.buttons}>
        <NextStepButton onClick={nextWithValidate} />
      </div>
    </>
  );
};
export default FirstStep;
