import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import MaynLayout from '../../../Core/MainLayout';
import Dashboard from '../../../Core/Dashboard';
import TitleBlock from '../../../Core/TitleBlock';
import GroupingIcon from '../../../Icons/3People';
import PageLayout from '../../../Core/PageLayout';
import {
  AccountGroupsSelector,
  isLoadingSelector, isShowSnackbar, snackbarText, snackbarType,
} from '../../../../store/settings/selectors';
import Progress from '../../../Core/Progress';
import GroupsBlock from './GroupsBlock';
import SubgroupsBlock from './SubgroupsBlock';
import style from './grouping.module.scss';
import { getAccountGroups } from '../../../../store/settings/actions';

export default function Grouping() {
  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const Groups = useSelector(AccountGroupsSelector);

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
  const { id } = useParams();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [selected, setSelected] = useState();

  useEffect(() => {
    dispatch(getAccountGroups(id));
  }, [dispatch, id]);

  const groups = useMemo(() => {
    if (Groups) {
      return Groups.map((group) => ({
        ...group,
        users: group.users?.length,
        subgroups: group.subgroups?.length,
      }));
    }
    return [];
  }, [Groups]);

  const subgroups = useMemo(() => {
    if (selected && Groups) {
      const selectedGroup = Groups.find((group) => group.id === selected.id);
      return selectedGroup.subgroups.map((subgroup) => ({
        ...subgroup,
        users: subgroup.users.length,
      }));
    }
    return [];
  }, [Groups, selected]);

  useEffect(() => {
    console.log(subgroups);
  }, [subgroups]);

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
                  <GroupsBlock
                    style={style}
                    groups={groups}
                    loading={isLoading}
                    setSelected={setSelected}
                    selected={selected}
                  />
                  <SubgroupsBlock style={style} selected={selected} subgroups={subgroups} />
                </div>
              )
          }
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
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
