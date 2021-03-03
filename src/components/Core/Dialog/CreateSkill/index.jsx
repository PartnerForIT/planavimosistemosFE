import React, { useContext, useEffect, useState } from 'react';
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
  buttonTitle, createSkill,
  modules, initialValues,
}) {
  const { t } = useTranslation();
  const isSuperAdmin = useContext(AdminContext);
  const [formValues, setFormValues] = useState({
    name: '',
    cost: '',
    earn: '',
    use_rates: true,
  });

  const handleSkillChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleChangeRates = () => {
    setFormValues((prevState) => ({ ...prevState, use_rates: !prevState.use_rates }));
  };

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...initialValues,
        use_rates: Boolean(initialValues.use_rates),
      });
    }
  }, [initialValues]);

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Skill Name')} htmlFor='name' />
        <Input
          placeholder={`${t('Enter Skill name')}`}
          value={formValues.name}
          name='name'
          fullWidth
          onChange={handleSkillChange}
        />
      </div>
      {
        (isSuperAdmin || !!modules.cost_earning) && (
        <div className={style.ratesBlock}>
          <Label text={t('Use Rates')} htmlFor='rates' />
          <Switch
            onChange={handleChangeRates}
            offColor='#808F94'
            onColor='#0085FF'
            uncheckedIcon={false}
            checkedIcon={false}
            checked={formValues.use_rates}
            height={21}
            width={40}
          />
        </div>
        )
      }
      {
        (isSuperAdmin || !!modules.cost_earning) && (
          <div className={style.formControl}>
            <Label text={t('Cost, Hourly rate, $')} htmlFor='cost' />
            <Input
              placeholder={`${t('How much new user cost/h')}`}
              value={formValues.cost}
              name='cost'
              fullWidth
              onChange={handleSkillChange}
              disabled={!formValues.use_rates}
            />
          </div>
        )
      }
      {
        (isSuperAdmin || !!modules.profitability) && (
          <div className={style.formControl}>
            <Label text={t('Charge, Hourly rate, $')} htmlFor='earn' />
            <Input
              placeholder={`${t('How much you charge per h')}`}
              value={formValues.earn}
              disabled={!formValues.use_rates}
              name='earn'
              fullWidth
              onChange={handleSkillChange}
            />
          </div>
        )
      }
      <div className={style.buttonSaveBlock}>
        <Button
          disabled={formValues.name === ''}
          onClick={() => createSkill(formValues)}
          fillWidth
          size='big'
        >
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
