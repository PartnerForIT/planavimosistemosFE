import React, {
  useEffect,
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

export default () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    email, error,
  } = useSelector(companyServicesInfoSelector);
  useEffect(() => {
    dispatch(unlockAccount(token));
  }, [dispatch, token]);
  if (error) {
    history.push('/404');
  }
  return (
    <BackgroundWrapper className={classes.root}>
      <Card className={classes.card}>
        <Logo />
        <div className={classes.description}>
          <p>
            {`${t('Unblock Account text')}:`}
          </p>
          <p className={classes.black}>
            {email}
          </p>
          <Button onClick={() => dispatch(unlockUser({ token }))} className={classes.buttonBlock} size='large' green>
            {t('Unblock Account')}
          </Button>
          <SupportTicket title='Account Unblock process succesfully' className={classes.dialogWrapper} open>
            <div>
              <div className={classes.dialogUnderTitle}>
                Users unblocked and noticed
                <div className={classes.dialogText}>{email}</div>
              </div>
            </div>
          </SupportTicket>
        </div>
      </Card>
    </BackgroundWrapper>
  );
};
