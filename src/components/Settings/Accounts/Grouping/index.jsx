import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import MaynLayout from '../../../Core/MainLayout';
import Dashboard from '../../../Core/Dashboard';
import TitleBlock from '../../../Core/TitleBlock';
import GroupingIcon from '../../../Icons/3People';
import PageLayout from '../../../Core/PageLayout';
import {
  AccountGroupsSelector, groupsLoadingSelector,
  isLoadingSelector, isShowSnackbar, snackbarText, snackbarType,
} from '../../../../store/settings/selectors';
import Progress from '../../../Core/Progress';
import GroupsBlock from './GroupsBlock';
import SubgroupsBlock from './SubgroupsBlock';
import style from './grouping.module.scss';
import { createAccountGroup, createAccountSubgroup, getAccountGroups } from '../../../../store/settings/actions';

export default function Grouping() {
  const isLoading = useSelector(isLoadingSelector);
  const groupLoading = useSelector(groupsLoadingSelector);
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
  const addNewGroup = (data) => dispatch(createAccountGroup(id, { name: data }));
  const [selected, setSelected] = useState({});
  const addNewSubgroup = ({ name }) => dispatch(createAccountSubgroup(id, { name, parentGroupId: selected?.id }));

  useEffect(() => {
    dispatch(getAccountGroups(id));
  }, [dispatch, id]);

  const groups = useMemo(() => {
    if (Groups) {
      return Groups.map((group) => ({
        ...group,
        users: group.users?.length ?? 0,
        subgroups: group.subgroups?.length ?? 0,
      })) ?? [];
    }
    return [];
  }, [Groups]);

  const subgroups = useMemo(() => {
    if (!_.isEmpty(selected) && Groups) {
      const selectedGroup = Groups.find((group) => group.id === selected.id);
      return selectedGroup.subgroups?.map((subgroup) => ({
        ...subgroup,
        users: subgroup.users?.length ?? 0,
      })) ?? [];
    }
    return [];
  }, [Groups, selected]);

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
                    loading={groupLoading}
                    setSelected={setSelected}
                    selected={selected}
                    addNewGroup={addNewGroup}
                  />
                  <SubgroupsBlock
                    style={style}
                    selected={selected}
                    subgroups={subgroups}
                    addNewSubgroup={addNewSubgroup}
                  />
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
