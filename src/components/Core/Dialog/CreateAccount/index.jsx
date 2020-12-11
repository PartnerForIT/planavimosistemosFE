import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from './CreateAccount.module.scss';

export default function CreateAccount({
  handleClose,
  title,
  open,
  buttonTitle,
  job,
  setJob,
}) {
  const { t } = useTranslation();

  const [step, setStep] = useState(1);

  const stepUp = () => setStep((prevState) => (prevState < 3 ? prevState + 1 : prevState));
  const stepDown = () => setStep((prevState) => (prevState > 1 ? prevState - 1 : prevState));

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>

      <div className={style.progress}>
        <div className={style.progress_inner}>
          <span className={style.active} style={{ width: `${step * 33}%` }} />
        </div>
      </div>

      <div className={style.newAccount}>
        <div className={style.info}>info</div>
        <div className={style.divider} />
        <div className={style.form}>form</div>
      </div>

      {/* <Label text={t('Job name')} htmlFor='name' /> */}
      {/* <Input */}
      {/*  placeholder={`${t('Enter Job name')}`} */}
      {/*  value={job} */}
      {/*  name='name' */}
      {/*  fullWidth */}
      {/*  onChange={(e) => setJob(e.target.value)} */}
      {/* /> */}
      <div className={style.buttons}>
        <Button
          onClick={() => ({})}
          fillWidth
          size='big'
        >
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
