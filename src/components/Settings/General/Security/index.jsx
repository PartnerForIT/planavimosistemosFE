import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Switch from "react-switch";
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, settingWorkTime
} from '../../../../store/settings/selectors';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import SecurityIcon from '../../../Icons/Security';
import Progress from '../../../Core/Progress';
import Snackbar from '@material-ui/core/Snackbar';

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

export default function Sesurity() {
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

  const [linkToEmail, setLinkToEmail] = useState(false);

  const handleChange = () => {
    setLinkToEmail(!linkToEmail);
  }

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Security"}
        >
          <SecurityIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress /> :

              <div>
                <Switch
                  onChange={handleChange}
                  offColor={'#808F94'}
                  onColor={'#0085FF'}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  checked={linkToEmail}
                  height={21}
                  width={40}
                />
              </div>
          }

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