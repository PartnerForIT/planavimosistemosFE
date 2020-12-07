import React from 'react';
import { useSelector } from 'react-redux';
import MaynLayout from '../../../Core/MainLayout';
import Dashboard from '../../../Core/Dashboard';
import TitleBlock from '../../../Core/TitleBlock';
import GroupingIcon from '../../../Icons/3People';
import PageLayout from '../../../Core/PageLayout';
import {
  isLoadingSelector, isShowSnackbar, snackbarText, snackbarType,
} from '../../../../store/settings/selectors';
import Progress from '../../../Core/Progress';

export default function Grouping() {
  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title='Grouping'
        >
          <GroupingIcon />
        </TitleBlock>
        {
          isLoadind ? <Progress />
            : (
              <>
                <div />
                <div />
              </>
            )
        }
        <PageLayout />
      </Dashboard>
    </MaynLayout>
  );
}
