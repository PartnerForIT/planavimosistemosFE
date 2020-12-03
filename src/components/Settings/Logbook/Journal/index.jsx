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
import Form from './Form';
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
    merge_entries: false,
    profitability: false,
    approve_flow: false,
    automatic_approval: false,
    approved_at: 'day',
    automatic_break: false,
    workday_exceed: '4',
    break_duration: '30',
  });

  useEffect(() => {
    if (id) {
      dispatch(loadLogbookJournal(id))
    }
  }, []);

  useEffect(() => {
    if (Object.keys(Journal).length > 0) {
      setJournalData({
        hourly_charge: Journal.hourly_charge ? Journal.hourly_charge : '',
        hourly_cost: Journal.hourly_cost ? Journal.hourly_cost : '',
        show_earned_salary: Journal.show_earned_salary === 0 ? false : true,
        merge_entries: Journal.merge_entries === 0 ? false : true,
        profitability: Journal.profitability === 0 ? false : true,
        approve_flow: Journal.approve_flow === 0 ? false : true,
        automatic_approval: Journal.automatic_approval === 0 ? false : true,
        approved_at: Journal.approved_at ? Journal.approved_at : 'day',
        automatic_break: Journal.automatic_break === 0 ? false : true,
        workday_exceed: Journal.workday_exceed ? Journal.workday_exceed : '4',
        break_duration: Journal.break_duration ? Journal.break_duration : '30',
      })
    }
  }, [Journal]);

  const handleInputChange = event => {
    const { name, value, type } = event.target;
    if (type === 'checkbox') {
      setJournalData({ ...journalData, [name]: !journalData[name] });
    } else {
      setJournalData({ ...journalData, [name]: value });
    }
  };

  const handleChangeApproveFlow = () => {
    setJournalData({ ...journalData, approve_flow: !journalData.approve_flow });
  }

  const handleChangeAutomaticApprove = () => {
    setJournalData({ ...journalData, automatic_approval: !journalData.automatic_approval });
  }
  const handleChangeAutomaticBreak = () => {
    setJournalData({ ...journalData, automatic_break: !journalData.automatic_break });
  }

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
                <Form
                  t={t}
                  style={styles}
                  handleInputChange={handleInputChange}
                  journalData={journalData}
                  handleChangeApproveFlow={handleChangeApproveFlow}
                  handleChangeAutomaticApprove={handleChangeAutomaticApprove}
                  handleChangeAutomaticBreak={handleChangeAutomaticBreak}
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