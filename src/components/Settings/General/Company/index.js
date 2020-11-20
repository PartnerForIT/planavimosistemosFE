import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard'
import CompanyIcon from '../../../Icons/Company';
import { DropzoneDialog } from 'material-ui-dropzone';
import Form from './Form';
import Progress from '../../../Core/Progress';
import { getSettingCompany, editSettingCompany } from '../../../../store/settings/actions';
import { getCountries } from '../../../../store/organizationList/actions';
import { settingCompanySelector, isLoadingSelector, isShowSnackbar, snackbarType, snackbarText } from '../../../../store/settings/selectors';
import { countriesSelector } from '../../../../store/organizationList/selectors';
import Snackbar from '@material-ui/core/Snackbar';
import styles from './company.module.scss';

const useStyles = makeStyles(() => ({
  error: {
    background: '#de4343',
    color: "#fff",
  },
  success: {
    background: '#3bc39e',
    color: "#fff",
  }
}));

export default function Company() {
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [companyId, setCompanyId] = useState(null);
  const [open, SetOpen] = useState(false);
  const [file, setFile] = useState([]);
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
    if (params.id) {
      dispatch(getSettingCompany(params.id))
    }
  }, []);
  useEffect(() => {
    setCompanyId(params.id)
  }, [params]);

  const company = useSelector(settingCompanySelector);
  const countries = useSelector(countriesSelector);
  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

  useEffect(() => {
    setInputValues({
      ...inputValues,
      name: company.name || '',
      contact_person_name: company.contact_person_name || '',
      contact_person_email: company.contact_person_email || '',
      country: company.country,
      lang: company.lang || 'EN',
      timezone: company.timezone || 'UTC±00:00',
      date_format: company.date_format || 'DD MM YY',
      currency: company.currency || 'USD'
    })
  }, [company]);

  const handleOpen = () => {
    SetOpen(true)
  }
  const handleClose = () => {
    SetOpen(false)
  }
  const handleSave = (files) => {
    setFile(files);
    SetOpen(false)
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const editCompany = () => {
    // const data = new FormData();
    // if (file.length > 0) {
    //   data.append("logo", file);
    // }
    // Object.keys(inputValues).map(item => {
    //   data.append(item, inputValues[item]);
    // })
    const data = { ...inputValues, logo: file }
    dispatch(editSettingCompany(data, companyId))
  }

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Company"}
        >
          <CompanyIcon />
        </TitleBlock>
        <PageLayout>
          {isLoadind ? <Progress /> :
            <Form
              styles={styles}
              handleOpen={handleOpen}
              handleInputChange={handleInputChange}
              inputValues={inputValues}
              countries={countries}
              editCompany={editCompany}
            />
          }
          <DropzoneDialog
            open={open}
            onSave={handleSave}
            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
            showPreviews={true}
            maxFileSize={500000}
            onClose={handleClose}
            filesLimit={1}
          />
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            ContentProps={{
              classes: {
                root: typeSnackbar === 'error' ? classes.error : classes.success
              }
            }}
            severity="error"
            open={isSnackbar}
            message={textSnackbar}
            key={"rigth"}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>

  )
}