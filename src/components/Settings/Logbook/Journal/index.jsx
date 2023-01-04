import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Snackbar from '@material-ui/core/Snackbar';

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
import usePermissions from '../../../Core/usePermissions';

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

const permissionsConfig = [
  {
    name: 'logbook_settings',
    permission: 'logbook_edit_settings',
  },
  {
    name: 'profitability',
    module: 'profitability',
  },
  {
    name: 'cost',
    module: 'cost_earning',
  },
  {
    name: 'comments_photo',
    module: 'comments_photo',
  },
  {
    name: 'use_approval_flow',
    module: 'use_approval_flow',
  },
];
export default function Journal() {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const permissions = usePermissions(permissionsConfig);

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const journal = useSelector(JournalDataSelector);

  const [journalData, setJournalData] = useState({
    hourly_charge: '',
    hourly_cost: '',
    show_earned_sallary: false,
    merge_entries: false,
    profitability: false,
    approve_flow: false,
    automatic_approval: false,
    approved_at: 'day',
    automatic_break: false,
    workday_exceed: '4',
    break_duration: '30',
    automatic_break2: false,
    workday_exceed2: '8',
    break_duration2: '60',
    end_day_comment: false,
    end_day_photo: false,
  });

  useEffect(() => {
    dispatch(loadLogbookJournal(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (Object.keys(journal).length > 0) {
      setJournalData({
        hourly_charge: journal.hourly_charge ? journal.hourly_charge : '',
        hourly_cost: journal.hourly_cost ? journal.hourly_cost : '',
        show_earned_sallary: journal.show_earned_sallary !== 0,
        merge_entries: journal.merge_entries !== 0,
        profitability: journal.profitability !== 0,
        approve_flow: journal.approve_flow !== 0,
        automatic_approval: journal.automatic_approval !== 0,
        approved_at: journal.approved_at ? journal.approved_at : 'day',
        automatic_break: journal.automatic_break !== 0,
        automatic_break2: journal.automatic_break2 !== 0,
        end_day_comment: journal.end_day_comment !== 0,
        end_day_photo: journal.end_day_photo !== 0,
        workday_exceed: journal.workday_exceed ? journal.workday_exceed : '4',
        break_duration: journal.break_duration ? journal.break_duration : '30',
        workday_exceed2: journal.workday_exceed2 ? journal.workday_exceed2 : '8',
        break_duration2: journal.break_duration2 ? journal.break_duration2 : '60',
      });
    }
  }, [journal]);

  const submit = useCallback((payload) => {
    const data = {
      hourly_charge: payload.hourly_charge,
      hourly_cost: payload.hourly_cost,
      show_earned_sallary: payload.show_earned_sallary ? 1 : 0,
      merge_entries: payload.merge_entries ? 1 : 0,
      profitability: payload.profitability ? 1 : 0,
      approve_flow: payload.approve_flow ? 1 : 0,
      automatic_approval: payload.automatic_approval ? 1 : 0,
      end_day_comment: payload.end_day_comment ? 1 : 0,
      end_day_photo: payload.end_day_photo ? 1 : 0,
      approved_at: payload.approved_at,
      automatic_break: payload.automatic_break ? 1 : 0,
      workday_exceed: payload.workday_exceed,
      break_duration: payload.break_duration,
      automatic_break2: payload.automatic_break2 ? 1 : 0,
      workday_exceed2: payload.workday_exceed2,
      break_duration2: payload.break_duration2,
    };
    dispatch(editLogbookJournal(id, data));
  }, [dispatch, id]);

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
  const handleChangeAutomaticBreak2 = () => {
    setJournalData({ ...journalData, automatic_break2: !journalData.automatic_break2 });
    submit({ ...journalData, automatic_break2: !journalData.automatic_break2 });
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
                <Form
                  t={t}
                  style={styles}
                  handleInputChange={handleInputChange}
                  journalData={journalData}
                  handleChangeApproveFlow={handleChangeApproveFlow}
                  handleChangeAutomaticApprove={handleChangeAutomaticApprove}
                  handleChangeAutomaticBreak={handleChangeAutomaticBreak}
                  handleChangeAutomaticBreak2={handleChangeAutomaticBreak2}
                  readOnly={!permissions.logbook_settings}
                  permissions={permissions}
                />
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
