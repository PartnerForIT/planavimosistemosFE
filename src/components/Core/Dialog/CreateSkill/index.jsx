import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import usePermissions from '../../usePermissions';
import style from '../Dialog.module.scss';

const permissionsConfig = [
  {
    name: 'cost_earning',
    module: 'cost_earning',
  },
  {
    name: 'profitability',
    module: 'profitability',
  },
];
export default function CreateSkill({
  handleClose, title, open,
  buttonTitle, createSkill, initialValues,
}) {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({
    name: '',
    cost: '',
    earn: '',
    use_rates: true,
  });
  const permissions = usePermissions(permissionsConfig);

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
        permissions.cost_earning && (
          <>
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
          </>
        )
      }
      {
        permissions.profitability && (
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
