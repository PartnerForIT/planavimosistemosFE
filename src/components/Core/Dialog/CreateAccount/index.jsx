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
  shifts,
  job_types,
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
    shift_id: null,
    job_type_id: null,
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
    close();
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
        if (name == 'place') {
          const nextValues = {
            ...prevState,
            [name]: value,
          };

          if (prevState.shift_id) {
            const foundShift = shifts.find(({ id }) => id === prevState.shift_id);
            if (foundShift && foundShift.place_id != value) {
              delete nextValues.shift_id;
            }
          }

          if (prevState.job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id == nextValues?.shift_id)) {
              delete nextValues.job_type_id;
            }
          }

          return nextValues;
        }
        
        if (name == 'shift_id') {
          const nextValues = {
            ...prevState,
            [name]: value,
          };

          if (prevState.job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id == value)) {
              delete nextValues.job_type_id;
            }
          }

          return nextValues;
        }

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
          shifts={shifts}
          job_types={job_types}
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
