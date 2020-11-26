import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Label from '../../Core/InputLabel';
import Button from '../../Core/Button/Button';
import DialodCreateSkill from '../../Core/Dialog/CreateSkill';
import { createSkill } from '../../../store/settings/actions';


export default function ButtonBlock({ style, companyId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false)
  const [skillName, setSkillName] = useState({
    name: '',
    cost: '',
    earn: '',
    rates: true
  })

  const handleSkillChange = event => {
    const { name, value } = event.target;
    setSkillName({ ...skillName, [name]: value });
  };

  const handleChangeRates = () => {
    setSkillName({ ...skillName, rates: !skillName.rates });
  }

  const handleClose = () => {
    setOpen(false)
  }
  const createNewSkill = () => {
    dispatch(createSkill(skillName, companyId))
    setOpen(false)
  }

  return (
    <div className={style.categoryPage__Button}>
      <Label text={t('New skill')} htmlFor={"new_skill"} />
      <Button onClick={() => setOpen(true)} white fillWidth size='big'>
        {t('Create new skill')}
      </Button>
      <DialodCreateSkill
        open={open}
        handleClose={handleClose}
        handleSkillChange={handleSkillChange}
        skillName={skillName}
        handleChangeRates={handleChangeRates}
        title={t('Create new skill')}
        buttonTitle={t('Create new skill')}
        createSkill={createNewSkill}
      />
    </div>
  )
}