import React, { useState ,useEffect} from 'react';
import Dialog from '../index';
import style from './CreateAccount.module.scss';
import FirstStep from './First';
import SecondStep from './Second';
import Third from './Third';
import {errorPushEmployerSelector} from "../../../../store/settings/selectors";
import {useSelector} from "react-redux";

export default function CreateAccount({
  handleClose,
  title,
  open,
  companyId,
  skills,
  groups,
  places,
  security,
  createAccount,
  firstUser,
}) {
  const initialUser = {
    photo: '',
    email: '',
    name: '',
    surname: '',
    external_id: null,
    skill: null,
    subgroup: null,
    group: null,
    cost: null,
    charge: null,
    place: null,
    password: '',
  };
  const [step, setStep] = useState(1);

  const [user, setUser] = useState(initialUser);

  const stepUp = () => setStep((prevState) => (prevState < 3 ? prevState + 1 : prevState));
  const stepDown = () => setStep((prevState) => (prevState > 1 ? prevState - 1 : prevState));

  const closeStat = useSelector(errorPushEmployerSelector);

  const close = () => {
    setUser(initialUser);
    setStep(1);
    handleClose();
  };

  const create = (data) => {
    createAccount(data);
  };
  useEffect(() => {
    if (closeStat === false) {
      close();
    }
  }, [closeStat]);
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
      handleClose={close}
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
          security={security}
          create={create}
          firstUser={firstUser}
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
