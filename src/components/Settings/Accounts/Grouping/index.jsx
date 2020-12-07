import React from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import MaynLayout from '../../../Core/MainLayout';
import Dashboard from '../../../Core/Dashboard';
import TitleBlock from '../../../Core/TitleBlock';
import GroupingIcon from '../../../Icons/3People';
import PageLayout from '../../../Core/PageLayout';
import {
  isLoadingSelector, isShowSnackbar, snackbarText, snackbarType,
} from '../../../../store/settings/selectors';
import Progress from '../../../Core/Progress';
import GroupsBlock from './GroupsBlock';
import SubgroupsBlock from './SubgroupsBlock';
import style from './grouping.module.scss';

export default function Grouping() {
  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

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
  const classes = useStyles();

  const { t } = useTranslation();

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Grouping')}
        >
          <GroupingIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <div className={style.grid}>
                  <GroupsBlock style={style} />
                  <SubgroupsBlock style={style} />
                </div>
              )
          }
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
            key='right'
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
