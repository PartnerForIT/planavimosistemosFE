import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Snackbar from '@material-ui/core/Snackbar';
import { debounce } from 'lodash';

import { companyModules } from '../../../../store/company/selectors';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import JournalIcon from '../../../Icons/JournalIcon';
import Progress from '../../../Core/Progress';
import Form from './Form';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, JournalDataSelector,
} from '../../../../store/settings/selectors';
import { loadLogbookJournal, editLogbookJournal } from '../../../../store/settings/actions';
import styles from '../logbook.module.scss';

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

export default function Journal() {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const journal = useSelector(JournalDataSelector);
  const modules = useSelector(companyModules);

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
    comments_required: false,
    photo_required: false,
  });

  useEffect(() => {
    dispatch(loadLogbookJournal(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (Object.keys(journal).length > 0) {
      setJournalData({
        hourly_charge: journal.hourly_charge ? journal.hourly_charge : '',
        hourly_cost: journal.hourly_cost ? journal.hourly_cost : '',
        show_earned_salary: journal.show_earned_salary !== 0,
        merge_entries: journal.merge_entries !== 0,
        profitability: journal.profitability !== 0,
        approve_flow: journal.approve_flow !== 0,
        automatic_approval: journal.automatic_approval !== 0,
        approved_at: journal.approved_at ? journal.approved_at : 'day',
        automatic_break: journal.automatic_break !== 0,
        workday_exceed: journal.workday_exceed ? journal.workday_exceed : '4',
        break_duration: journal.break_duration ? journal.break_duration : '30',
      });
    }
  }, [journal]);

  const submit = useCallback(debounce((payload) => {
    const data = {
      hourly_charge: payload.hourly_charge,
      hourly_cost: payload.hourly_cost,
      show_earned_salary: payload.show_earned_salary ? 1 : 0,
      merge_entries: payload.merge_entries ? 1 : 0,
      profitability: payload.profitability ? 1 : 0,
      approve_flow: payload.approve_flow ? 1 : 0,
      automatic_approval: payload.automatic_approval ? 1 : 0,
      approved_at: payload.approved_at,
      automatic_break: payload.automatic_break ? 1 : 0,
      workday_exceed: payload.workday_exceed,
      break_duration: payload.break_duration,
    };
    dispatch(editLogbookJournal(id, data));
  }, 5000), [dispatch, id]);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    if (type === 'checkbox') {
      setJournalData({ ...journalData, [name]: !journalData[name] });
      submit({ ...journalData, [name]: !journalData[name] });
    } else {
      setJournalData({ ...journalData, [name]: value });
      submit({ ...journalData, [name]: value });
    }
  };

  const handleChangeApproveFlow = () => {
    setJournalData({ ...journalData, approve_flow: !journalData.approve_flow });
    submit({ ...journalData, approve_flow: !journalData.approve_flow });
  };

  const handleChangeAutomaticApprove = () => {
    setJournalData({ ...journalData, automatic_approval: !journalData.automatic_approval });
    submit({ ...journalData, automatic_approval: !journalData.automatic_approval });
  };
  const handleChangeAutomaticBreak = () => {
    setJournalData({ ...journalData, automatic_break: !journalData.automatic_break });
    submit({ ...journalData, automatic_break: !journalData.automatic_break });
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title='Journal'
        >
          <JournalIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <>
                  <Form
                    t={t}
                    style={styles}
                    handleInputChange={handleInputChange}
                    journalData={journalData}
                    handleChangeApproveFlow={handleChangeApproveFlow}
                    handleChangeAutomaticApprove={handleChangeAutomaticApprove}
                    handleChangeAutomaticBreak={handleChangeAutomaticBreak}
                    modules={modules}
                  />
                </>
              )
          }
        </PageLayout>
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
      </Dashboard>
    </MaynLayout>
  );
}
