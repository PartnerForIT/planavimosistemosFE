import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaynLayout from '../../../Core/MainLayout';
import Dashboard from '../../../Core/Dashboard';
import TitleBlock from '../../../Core/TitleBlock';
import PageLayout from '../../../Core/PageLayout';
import Progress from '../../../Core/Progress';
import {
  isLoadingSelector, isShowSnackbar, rolesLoading, rolesSelector, snackbarText, snackbarType,
} from '../../../../store/settings/selectors';
import RolesIcon from '../../../Icons/RolesIcon';
import RolesBlock from './RolesBlock';
import { getRoles } from '../../../../store/settings/actions';

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

function Roles() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const roles = useSelector(rolesSelector);
  const loading = useSelector(rolesLoading);

  const [activeRole, setActiveRole] = useState({ });
  const [newRoleOpen, setNewRoleOpen] = useState(false);

  useEffect(() => {
    dispatch(getRoles(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Roles')}
        >
          <RolesIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <>
                  <RolesBlock
                    roles={roles}
                    activeRole={activeRole}
                    setActiveRole={setActiveRole}
                    createNewRole={() => setNewRoleOpen(true)}
                  />
                  <pre>
                    {JSON.stringify(roles, null, 2)}
                  </pre>
                </>
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
            key='rigth'
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}

export default Roles;
