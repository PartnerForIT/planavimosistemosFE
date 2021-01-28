import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Tooltip from '../../Core/Tooltip';
import Label from '../../Core/InputLabel';
import Button from '../../Core/Button/Button';
import DialogCreateSkill from '../../Core/Dialog/CreateSkill';
import DialogCreateJob from '../../Core/Dialog/CreateJob';
import DialogCreatePlace from '../../Core/Dialog/CreatePlace';
import { createSkill, actionCreateJob, actuionCreatePlace } from '../../../store/settings/actions';

export default function ButtonBlock({ style, companyId, modules }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openNewSkill, setOpenNewSkill] = useState(false);
  const [openJob, setOpenJob] = useState(false);
  const [openPlace, setOpenPlace] = useState(false);
  const [job, setJob] = useState('');
  const [place, setPlace] = useState('');

  const [skillName, setSkillName] = useState({
    name: '',
    cost: '',
    earn: '',
    rates: true,
  });

  const handleSkillChange = (event) => {
    const { name, value } = event.target;
    setSkillName({ ...skillName, [name]: value });
  };

  const handleChangeRates = () => {
    setSkillName({ ...skillName, rates: !skillName.rates });
  };

  const handleCloseSkill = () => {
    setOpenNewSkill(false);
  };
  const handleCloseJob = () => {
    setOpenJob(false);
  };
  const handleClosePlace = () => {
    setOpenPlace(false);
  };
  const createNewSkill = () => {
    dispatch(createSkill(skillName, companyId));
    setOpenNewSkill(false);
  };

  const createJob = () => {
    dispatch(actionCreateJob({ title: job }, companyId));
    setOpenJob(false);
    setJob('');
  };

  const createPlace = () => {
    dispatch(actuionCreatePlace({ name: place }, companyId));
    setOpenPlace(false);
    setPlace('');
  };
  return (
    <div className={style.categoryPage__Button}>
      <div className={style.labelBlock}>
        <Label text={t('Select Category')} htmlFor='new_skill' />
        <Tooltip title='Select Category' />
      </div>
      <Button onClick={() => setOpenNewSkill(true)} fillWidth size='big'>
        {t('Skill name')}
      </Button>
      <Button onClick={() => setOpenJob(true)} inverse fillWidth size='big'>
        {t('Job name')}
      </Button>
      <Button onClick={() => setOpenPlace(true)} inverse fillWidth size='big'>
        {t('Place name')}
      </Button>
      <div className={style.newSkillBlock}>
        <Label text={t('New skill')} htmlFor='new_skill' />
        <Button onClick={() => setOpenNewSkill(true)} white fillWidth size='big'>
          {t('Create new skill')}
        </Button>
      </div>
      <DialogCreateSkill
        open={openNewSkill}
        handleClose={handleCloseSkill}
        handleSkillChange={handleSkillChange}
        skillName={skillName}
        handleChangeRates={handleChangeRates}
        title={t('Create new skill')}
        buttonTitle={t('Create new skill')}
        createSkill={createNewSkill}
        modules={modules}
      />
      <DialogCreateJob
        open={openJob}
        handleClose={handleCloseJob}
        title={t('Create Job name')}
        buttonTitle={t('Create Job Name')}
        setJob={setJob}
        createJob={createJob}
        job={job}
      />
      <DialogCreatePlace
        open={openPlace}
        handleClose={handleClosePlace}
        title={t('Create Place name')}
        buttonTitle={t('Create Palce Name')}
        setPlace={setPlace}
        createPlace={createPlace}
        job={place}
      />
    </div>
  );
}
