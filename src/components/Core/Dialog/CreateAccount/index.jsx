import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from './CreateAccount.module.scss';
import FirstStep from './First';
import SecondStep from './Second';
import Third from './Third';

export default function CreateAccount({
  handleClose,
  title,
  open,
  companyId,
  skills,
  groups,
  places,
}) {
  const { t } = useTranslation();
  const initialUser = {
    photo: '',
    email: 'test@test.com',
    name: 'Anthony',
    surname: 'Soprano',
    external_id: '12313',
  };
  const [step, setStep] = useState(3);

  const [user, setUser] = useState(initialUser);

  const stepUp = () => setStep((prevState) => (prevState < 3 ? prevState + 1 : prevState));
  const stepDown = () => setStep((prevState) => (prevState > 1 ? prevState - 1 : prevState));

  const handleInput = (e) => {
    const {
      name,
      value,
    } = e.target;

    setUser((prevState) => {
      if (name !== 'group') {
        return {
          ...prevState,
          [name]: value,
        };
      }
      const {
        subgroup: $,
        ...rest
      } = prevState;
      return {
        ...rest,
        [name]: value,
      };
    });
  };

  return (
    <Dialog
      handleClose={() => {
        setUser(initialUser);
        setStep(1);
        handleClose();
      }}
      open={open}
      title={title}
    >

      <div className={style.progress}>
        <div className={style.progress_inner}>
          <span className={style.active} style={{ width: `${step * 33}%` }} />
        </div>
      </div>

      <div className={style.newAccount}>

        <StepWrapper
          step={step}
          user={user}
          handleInput={handleInput}
          nextStep={stepUp}
          previousStep={stepDown}
          companyId={companyId}
          skills={skills}
          groups={groups}
          places={places}
          setUser={setUser}
        />
      </div>

    </Dialog>
  );
}

const StepWrapper = ({
  step,
  ...rest
}) => {
  switch (step) {
    case 1:
      return (
        <FirstStep {...rest} />
      );
    case 2:
      return (
        <SecondStep {...rest} />
      );
    case 3:
      return (
        <Third {...rest} />
      );
    default:
      return (<></>);
  }
};
