import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { DropzoneDialog } from 'material-ui-dropzone';
import Snackbar from '@material-ui/core/Snackbar';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import CompanyIcon from '../../../Icons/Company';
import { imageResize } from '../../../Helpers';
import Form from './Form';
import Progress from '../../../Core/Progress';
import { getSettingCompany, editSettingCompany } from '../../../../store/settings/actions';
import { getCountries } from '../../../../store/organizationList/actions';
import {
  settingCompanySelector, isLoadingSelector, isShowSnackbar, snackbarType, snackbarText,
} from '../../../../store/settings/selectors';
import { countriesSelector } from '../../../../store/organizationList/selectors';
import styles from './company.module.scss';

const useStyles = makeStyles(() => ({
  error: {
    background: '#de4343',
    color: '#fff',
  },
  success: {
    background: '#3bc39e',
    color: '#fff',
  },
}));

export default function Company() {
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [open, SetOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [inputValues, setInputValues] = useState({
    country: '',
    lang: '',
    name: '',
    external_id: '',
    contact_person_name: '',
    contact_person_email: '',
    timezone: '',
    date_format: '',
  });

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);
  useEffect(() => {
    if (companyId) {
      dispatch(getSettingCompany(companyId));
    }
  }, [dispatch, companyId]);

  const company = useSelector(settingCompanySelector);
  const countries = useSelector(countriesSelector);
  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  // const currencies = useSelector(currencySelector);

  const [timeZones, setTimeZones] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    setInputValues((prevState) => ({
      ...prevState,
      name: company.name || '',
      contact_person_name: company.contact_person_name || '',
      contact_person_email: company.contact_person_email || '',
      country: company.country,
      lang: company.lang || 'EN',
      timezone: company.timezone || 'UTC±00:00',
      date_format: company.date_format || 'DD MM YY',
      currency: company.currency || 'USD',
    }));
    if (company.logo) {
      setFile(company.logo);
    }
  }, [company]);

  const handleOpen = () => {
    SetOpen(true);
  };
  const handleClose = () => {
    SetOpen(false);
  };

  const editCompany = useCallback((data) => {
    dispatch(editSettingCompany(data, companyId));
  }, [dispatch, companyId]);

  // eslint-disable-next-line no-shadow
  const handleSave = async (file) => {
    const base64 = await imageResize(file[0]);
    setFile(base64);
    SetOpen(false);
    // editCompany({ ...inputValues, logo: file });
    dispatch(editSettingCompany({ ...inputValues, logo: base64 }, companyId));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextInputValues = { ...inputValues, [name]: value };
    setInputValues({ ...nextInputValues});
    editCompany(nextInputValues);
  };

  useEffect(() => {
    if (inputValues.country && countries.length) {
      const foundCountry = countries.find(({ code }) => code === inputValues.country);
      setTimeZones(foundCountry?.timezones?.map((code) => ({ code, name: code })) ?? []);
      setCurrencies(foundCountry.currencies);
      if (foundCountry?.timezones?.[0] || foundCountry?.currencies?.[0]) {
        setInputValues((prevState) => ({
          ...prevState,
          timezone: foundCountry?.timezones?.[0] || '',
          currency: foundCountry?.currencies?.[0]?.code || '',
        }));
      }
    }
  }, [countries, inputValues.country]);

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title='Company'
        >
          <CompanyIcon />
        </TitleBlock>
        <PageLayout>
          {isLoadind ? <Progress />
            : (
              <Form
                styles={styles}
                handleOpen={handleOpen}
                handleInputChange={handleInputChange}
                inputValues={inputValues}
                countries={countries}
                currencies={currencies}
                file={file}
                company={company}
                timeZones={timeZones}
              />
            )}
          <DropzoneDialog
            open={open}
            onSave={handleSave}
            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
            showPreviews
            maxFileSize={500000}
            onClose={handleClose}
            filesLimit={1}
          />
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            ContentProps={{
              classes: {
                root: typeSnackbar === 'error' ? classes.error : classes.success,
              },
            }}
            severity='error'
            open={isSnackbar}
            message={textSnackbar}
            key='rigth'
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
