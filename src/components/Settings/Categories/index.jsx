import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import { companyModules } from '../../../store/company/selectors';
import MaynLayout from '../../Core/MainLayout';
import PageLayout from '../../Core/PageLayout';
import TitleBlock from '../../Core/TitleBlock';
import Dashboard from '../../Core/Dashboard';
import CategoriesIcon from '../../Icons/Categories2';
import Progress from '../../Core/Progress';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, categoriesSkillsSelector,
} from '../../../store/settings/selectors';
import { loadSkills } from '../../../store/settings/actions';
import ButtonBlock from './ButtonsBlock';
import TableBlock from './TableBlock';

import styles from './categories.module.scss';

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

export default function Categories() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(loadSkills(id));
  }, [dispatch, id]);

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const skills = useSelector(categoriesSkillsSelector);
  const modules = useSelector(companyModules);

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title='Categories'
        >
          <CategoriesIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <div className={styles.categoryPage}>
                  <ButtonBlock style={styles} companyId={id} modules={modules} />
                  <TableBlock style={styles} skills={skills} modules={modules} />
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
            key='rigth'
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
