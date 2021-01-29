import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import { AdminContext } from '../../MainLayout';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function CreateSkill({
  handleClose, title, open,
  skillName, handleSkillChange, handleChangeRates, buttonTitle, createSkill,
  modules: { cost_earning: cost, profitability },

}) {
  const { t } = useTranslation();
  const SuperAdmin = useContext(AdminContext);
  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Skill Name')} htmlFor='name' />
        <Input
          placeholder={`${t('Enter Skill name')}`}
          value={skillName.name}
          name='name'
          fullWidth
          onChange={handleSkillChange}
        />
      </div>
      {
        (!!cost || SuperAdmin) && (
        <div className={style.ratesBlock}>
          <Label text={t('Use Rates')} htmlFor='rates' />
          <Switch
            onChange={handleChangeRates}
            offColor='#808F94'
            onColor='#0085FF'
            uncheckedIcon={false}
            checkedIcon={false}
            checked={skillName.rates}
            height={21}
            width={40}
          />
        </div>
        )
      }
      {
        (!!cost || SuperAdmin) && (
          <div className={style.formControl}>
            <Label text={t('Cost, Hourly rate, $')} htmlFor='cost' />
            <Input
              placeholder={`${t('How much new user cost/h')}`}
              value={skillName.cost}
              name='cost'
              fullWidth
              onChange={handleSkillChange}
            />
          </div>
        )
      }
      {
        ((!!cost && !!profitability) || SuperAdmin) && (
          <div className={style.formControl}>
            <Label text={t('Charge, Hourly rate, $')} htmlFor='earn' />
            <Input
              placeholder={`${t('How much you charge per h')}`}
              value={skillName.earn}
              name='earn'
              fullWidth
              onChange={handleSkillChange}
            />
          </div>
        )
      }
      <div className={style.buttonSaveBlock}>
        <Button disabled={skillName.name === ''} onClick={() => createSkill()} fillWidth size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
