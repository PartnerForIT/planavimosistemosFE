import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Snackbar from '@material-ui/core/Snackbar';
import MaynLayout from '../../Core/MainLayout';
import PageLayout from '../../Core/PageLayout';
import TitleBlock from '../../Core/TitleBlock';
import Dashboard from '../../Core/Dashboard';
import CategoriesIcon from '../../Icons/Categories2';
import Progress from '../../Core/Progress';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, categoriesSkillsSelector, scheduleSelector
} from '../../../store/settings/selectors';
import { jobTypesSelector, loadingJobTypeSelector } from '../../../store/jobTypes/selectors';
import { AccountGroupsSelector } from '../../../store/settings/selectors';
import { placesSelector, loadingPlaceSelector } from '../../../store/places/selectors';
import { customCategoriesSelector, loadingCustomCategoriesSelector } from '../../../store/customCategories/selectors';
import { loadSkills, getSchedule, getAccountGroups } from '../../../store/settings/actions';
import { getJobTypes } from '../../../store/jobTypes/actions';
import { getPlaces } from '../../../store/places/actions';
import { getCustomCategories } from '../../../store/customCategories/actions';
import ButtonBlock from './ButtonsBlock';
import TableBlock from './TableBlock';
import usePermissions from '../../Core/usePermissions';

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

const permissionsConfig = [
  {
    name: 'cost',
    module: 'cost_earning',
  },
  {
    name: 'profit',
    module: 'profitability',
  },
  {
    name: 'create_jobs',
    module: 'create_jobs',
  },
  {
    name: 'create_places',
    module: 'create_places',
  },
  {
    name: 'integrations',
    module: 'integrations',
  },
  {
    name: 'create_groups',
    module: 'create_groups',
  },
  {
    name: 'custom_category',
    module: 'custom_category',
  },
];
export default function Categories() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const permissions = usePermissions(permissionsConfig);
  const selectGroups = useSelector(AccountGroupsSelector);
  
  const [groups, setGroups] = useState([]);
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState('skills');

  useEffect(() => {
    dispatch(loadSkills(id));
    dispatch(getJobTypes(id));
    dispatch(getPlaces(id));
    dispatch(getSchedule(id));
    dispatch(getAccountGroups(id));
    dispatch(getCustomCategories(id));
  }, [dispatch, id]);

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const skills = useSelector(categoriesSkillsSelector);
  const allJobTypes = useSelector(jobTypesSelector);
  const allPlaces = useSelector(placesSelector);
  const allCustomCategories = useSelector(customCategoriesSelector);
  const isLoadingJobTypes = useSelector(loadingJobTypeSelector);
  const isLoadingPlaces = useSelector(loadingPlaceSelector);
  const isLoadingCustomCategories = useSelector(loadingCustomCategoriesSelector);
  const scheduleSettings = useSelector(scheduleSelector);

  useEffect(() => {
    if (Array.isArray(selectGroups)) {
      setGroups(selectGroups.map((item) => ({
        ...item,
        label: item.name,
        type: item?.subgroups?.length ? 'group' : '',
        items: item?.subgroups?.length ? item?.subgroups.map((itemJ) => ({
          ...itemJ,
          label: itemJ.name,
        })) : [],
      }), []));
    }
  }, [selectGroups]);

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Categories')}
        >
          <CategoriesIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <div className={styles.categoryPage}>
                  <ButtonBlock
                    style={styles}
                    companyId={id}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    permissions={permissions}
                  />
                  <TableBlock
                    style={styles}
                    skills={skills}
                    allJobTypes={allJobTypes}
                    allPlaces={allPlaces}
                    allCustomCategories={allCustomCategories}
                    permissions={permissions}
                    selectedCategory={selectedCategory}
                    loading={isLoadingJobTypes || isLoadingPlaces || isLoadingCustomCategories}
                    companyId={id}
                    scheduleSettings={scheduleSettings}
                    groups={groups}
                  />
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
