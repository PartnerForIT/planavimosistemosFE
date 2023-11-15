import React, {useEffect, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {currencySelector, settingCompanySelector, settingsLoadingSelector} from "../../../../store/settings/selectors";
import {getCurrencies, getSettingCompany} from "../../../../store/settings/actions";
import _ from "lodash";

const initialFormValues = {
  name: '',
  cost: '',
  earn: '',
  use_rates: false,
};
export default function CreateSkill({
  handleClose, title, open,
  buttonTitle, createSkill, initialValues, permissions,
}) {
  const { t } = useTranslation();
  const { id } = useParams();
  const currencies = useSelector(currencySelector);
  const company = useSelector(settingCompanySelector);
  const settingsLoading = useSelector(settingsLoadingSelector);
  const [formValues, setFormValues] = useState(initialFormValues);


  const handleSkillChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleChangeRates = () => {
    setFormValues((prevState) => ({ ...prevState, use_rates: !prevState.use_rates }));
  };
  const handleExited = () => {
    setFormValues(initialFormValues);
  };
  const onClose = () => {
    setFormValues(initialFormValues);
    handleClose();

  };

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...initialValues,
        use_rates: Boolean(initialValues.use_rates),
      });
    } else {
      setFormValues({
        ...initialFormValues,
      });
    }
  }, [initialValues, open]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (Array.isArray(currencies) && !currencies.length && !settingsLoading) {
      dispatch(getCurrencies());
    }
  }, [currencies, dispatch, settingsLoading]);

  useEffect(() => {
    if (_.isEmpty(company) && !settingsLoading) {
      dispatch(getSettingCompany(id));
    }
  }, [company, dispatch, id, settingsLoading]);

  const currency = useMemo(
      () => {
        if (Array.isArray(currencies)) {
          return currencies
              .find((curr) => curr.code === company?.currency || curr.name === company?.currency)?.symbol ?? '';
        }

        return '';
      },
      [company.currency, currencies],
  );

  return (
    <Dialog handleClose={onClose} onExited={handleExited} open={open} title={title}>
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
        permissions.cost && (
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
              <Label text={t(`Cost, Hourly rate`)+', '+currency} htmlFor='cost' />
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
        permissions.profit && (
          <div className={style.formControl}>
            <Label text={t(`Charge, Hourly rate`)+','+currency} htmlFor='earn' />
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
