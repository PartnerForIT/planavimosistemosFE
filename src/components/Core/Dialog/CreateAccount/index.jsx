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
  roles,
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
    hours_demand: '',
    approver_1: null,
    approver_2: null,
    effective_date: null,
    childrens: null,
    child_born_1: null,
    child_born_2: null,
    child_born_3: null,
    child_born_4: null,
    child_born_5: null,
    child_born_6: null,
    child_born_7: null,
    child_born_8: null,
    child_born_9: null,
    child_born_10: null,
    skill: null,
    subgroup: null,
    group: null,
    cost: null,
    charge: null,
    place: null,
    shift_id: null,
    role_id: null,
    job_type_id: null,
    assign_shift_id: null,
    assign_job_type_id: null,
    password: '',
  };
  
  const [step, setStep] = useState(1);

  const [user, setUser] = useState(initialUser);

  const stepUp = () => setStep((prevState) => (prevState < 3 ? prevState + 1 : prevState));
  const stepDown = () => setStep((prevState) => (prevState > 1 ? prevState - 1 : prevState));

  const closeStat = useSelector(errorPushEmployerSelector);

  // eslint-disable-next-line
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
  }, [closeStat, close]);
  const handleInput = (e) => {
    const {
      name,
      value,
    } = e.target;

    setUser((prevState) => {
      if (name !== 'group') {
        if (name === 'place') {
          const nextValues = {
            ...prevState,
            [name]: value,
          };

          if (prevState.shift_id) {
            const foundShift = shifts.find(({ id }) => id === prevState.shift_id);
            if (foundShift && foundShift.place_id !== value) {
              delete nextValues.shift_id;
            }
          }

          if (prevState.assign_shift_id) {
            const foundShift = shifts.find(({ id }) => id === prevState.assign_shift_id);
            if (foundShift && foundShift.place_id !== value) {
              delete nextValues.assign_shift_id;
            }
          }

          if (prevState.job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id === nextValues?.shift_id)) {
              delete nextValues.job_type_id;
            }
          }

          if (prevState.assign_job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.assign_job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id === nextValues?.assign_shift_id)) {
              delete nextValues.assign_job_type_id;
            }
          }

          return nextValues;
        }
        
        if (name === 'shift_id') {
          const nextValues = {
            ...prevState,
            [name]: value,
          };

          if (prevState.job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id === value)) {
              delete nextValues.job_type_id;
            }
          }

          return nextValues;
        }

        if (name === 'assign_shift_id') {
          const nextValues = {
            ...prevState,
            [name]: value,
          };

          if (prevState.assign_job_type_id) {
            const foundJT = job_types.find(({ id }) => id === prevState.assign_job_type_id);
            if (foundJT && !foundJT?.shifts.find(s => s.id === value)) {
              delete nextValues.assign_job_type_id;
            }
          }

          return nextValues;
        }

        if (name === 'approver_1') {
          return {
            ...prevState,
            [name]: value || null,
            approver_2: value ? prevState.approver_2 : null,
          };
        }

        if (name === 'approver_2') {
          return {
            ...prevState,
            [name]: value || null,
          };
        }

        return {
          ...prevState,
          role_id: prevState.role_id || ((roles ? roles.find(r => r.default)?.id : null) || null),
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
          roles={roles}
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
