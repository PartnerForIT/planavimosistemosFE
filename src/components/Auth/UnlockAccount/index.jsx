import React, {
  useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { unlockUser, unlockAccount } from '../../../store/services/actions';
import companyServicesInfoSelector from '../../../store/services/selectors';
import BackgroundWrapper from '../BackgroundWrapper';
import Card from '../../Card';
import Logo from '../../Logo';
import classes from './UnlockAccount.module.scss';
import Button from '../../Core/Button/Button';
import SupportTicket from '../../Core/Dialog';
import SuccessIcon from '../../Icons/SuccessIcon';

export default () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const {
    email, error, status,
  } = useSelector(companyServicesInfoSelector);
  useEffect(() => {
    dispatch(unlockAccount(token));
  }, [dispatch, token]);
  if (error) {
    history.push('/404');
  }
  useEffect(() => {
    setOpen(status);
  }, [status]);
  return (
    <BackgroundWrapper className={classes.root}>
      <Card className={classes.card}>
        <Logo />
        <div className={classes.description}>
          <p>
            {`${t('You have initiated unblock process for ')}:`}
          </p>
          <p className={classes.black}>
            {email}
          </p>
          <Button onClick={() => dispatch(unlockUser({ token }))} className={classes.buttonBlock} size='large' green>
            {t('Unblock Account')}
          </Button>
          {/* eslint-disable-next-line max-len */}
          <SupportTicket title={t('Account Unblock process succesfully')} className={classes.dialogWrapper} open={open} onExited={() => { history.push('/'); }}>
            <div>
              <div className={classes.dialogUnderTitle}>
                Users unblocked and noticed
                <div className={classes.dialogText}>{email}</div>
                <Button className={classes.buttonBlock} onClick={() => history.push('/')} size='large' green>
                  <SuccessIcon />
                </Button>
              </div>
            </div>
          </SupportTicket>
        </div>
      </Card>
    </BackgroundWrapper>
  );
};
