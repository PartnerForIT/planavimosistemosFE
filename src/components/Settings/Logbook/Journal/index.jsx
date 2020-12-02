import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Switch from "react-switch";
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard'
import JournalIcon from '../../../Icons/JournalIcon';
import Progress from '../../../Core/Progress';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '../../../Core/Tooltip';
import General from './General';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, JournalDataSelector
} from '../../../../store/settings/selectors';
import { loadLogbookJournal } from '../../../../store/settings/actions';
import styles from '../logbook.module.scss';

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

export default function Journal() {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const Journal = useSelector(JournalDataSelector)

  const [journalData, setJournalData] = useState({
    hourly_charge: '',
    hourly_cost: '',
    show_earned_salary: false,
    merge_entries: false
  });

  useEffect(() => {
    if (id) {
      dispatch(loadLogbookJournal(id))
    }
  }, []);

  const handleInputChange = event => {
    const { name, value, type } = event.target;

    console.log(name, value, type)

    if (type === 'checkbox') {
      setJournalData({ ...journalData, [name]: !journalData.show_earned_salary });
    } else {
      setJournalData({ ...journalData, [name]: value });
    }
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Journal"}
        >
          <JournalIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress /> :
              <>
                <General
                  t={t}
                  style={styles}
                  handleInputChange={handleInputChange}
                  journalData={journalData}
                />
              </>
          }
        </PageLayout>
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
      </Dashboard>
    </MaynLayout>

  )
}