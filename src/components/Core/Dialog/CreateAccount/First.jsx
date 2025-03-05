import React, { useEffect, useState } from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import classnames from 'classnames';

import { useDispatch } from 'react-redux';
import { dropStatusEmployer } from 'store/settings/actions';
import style from './CreateAccount.module.scss';
import PlaceholderAvatar from '../../../Icons/PlaceholderAvatar';
import Button from '../../Button/Button';
import { imageResize } from '../../../Helpers';
import Label from '../../InputLabel';
import Input from '../../Input/Input';
import Tooltip from '../../../Core/Tooltip';
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
  const handleSave = async (images) => {
    const image = await imageResize(images[0]);
    setFile(image);
    setUploadVisible(false);
  };

  const [errors, setErrors] = useState({});

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      setUser((prevState) => ({ ...prevState, photo: file }));
    }
  }, [file, setUser]);

  const nextWithValidate = () => {
    const { email } = user;
    dispatch(dropStatusEmployer());
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

  const handleInputStatus = (e) => {
    const {value} = e.target;
    handleInput({target: {name: 'em_status', value: value}});
  }

  const handleBlurStatus = () => {
    let value = parseFloat(user.em_status);

    if (isNaN(value) || value < 0.001) {
      value = 0.001;
    } else if (value > 1.5) {
      value = 1.5;
    }

    handleInput({target: {name: 'em_status', value: value.toFixed(3)}});
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
              {
                user.photo ? (
                  <img className={style.avatar} src={user.photo} alt={t('avatar')} />
                ) : (
                  <PlaceholderAvatar className={style.avatar} />
                )
              }
              <Button inverse fillWidth size='medium' onClick={() => setUploadVisible(true)}>{t('Upload')}</Button>
            </div>
            <DropzoneDialog
              open={uploadVisible}
              onSave={handleSave}
              acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
              showPreviews
              maxFileSize={9000000}
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
                autoComplete='email'
                placeholder={t('New user email')}
                value={user.email ?? ''}
                onChange={handleInput}
              />
              {
                errors.email
                && <small className={style.error}>{errors.email}</small>
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
                && <small className={style.error}>{errors.name}</small>
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
                && <small className={style.error}>{errors.surname}</small>
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

            <div className={style.formItem}>
              <span className={style.labelSpan}>
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

          </form>
        </div>
      </div>
      <div className={style.buttons}>
        <NextStepButton className={style.nextButton} onClick={nextWithValidate} />
      </div>
    </>
  );
};
export default FirstStep;
