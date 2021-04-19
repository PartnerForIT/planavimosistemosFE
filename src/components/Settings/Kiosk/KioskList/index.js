import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import MainLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import Button from '../../../Core/Button/Button';
import Label from '../../../Core/InputLabel';
import InputSelect from '../../../Core/InputSelect';
import DataTable from '../../../Core/DataTableCustom/OLT';
import Kiosk2Icon from '../../../Icons/Kiosk2';
import {
  isShowSnackbar,
  securityCompanySelector,
  snackbarText,
  snackbarType,
} from '../../../../store/settings/selectors';
import StyledCheckbox from '../../../Core/Checkbox/Checkbox';
import DialogCreateKiosk from '../../../Core/Dialog/CreateKiosk';
import DialogEditPasswordKiosk from '../../../Core/Dialog/EditPasswordKiosk';
import DeleteItem from '../../../Core/Dialog/DeleteItem';
import Tooltip from '../../../Core/Tooltip';
import { placesSelector } from '../../../../store/places/selectors';
import { getPlaces } from '../../../../store/places/actions';
import styles from './KioskList.module.scss';

const data = [
  {
    id: 'ed',
    name: 'name',
    place: 'place',
    admin: 'admin',
    password: 'password',
  },
  {
    id: 'ed',
    name: 'name 3',
    place: 'place 3',
    admin: 'admin 3',
    password: 'password 3',
  },
];
export default () => {
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
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

  useEffect(() => {
    dispatch(getPlaces(companyId));
  }, [dispatch, companyId]);

  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const security = useSelector(securityCompanySelector);
  const allPlaces = useSelector(placesSelector);

  const [selectedItemId, setSelectedItemId] = useState('');
  const [deleteKioskVisible, setDeleteKioskVisible] = useState(false);
  const [viewPasswordVisible, setViewPasswordVisible] = useState(false);
  const [createEditKioskVisible, setCreateEditKioskVisible] = useState(false);

  const columns = useMemo(() => [
    { label: 'Kiosk name', field: 'name', checked: true },
    { label: 'Assigned to place', field: 'place', checked: true },
    { label: 'Kiosk admin user', field: 'admin', checked: true },
    {
      label: 'Password',
      field: 'password',
      cellRenderer: ({ id }) => (
        <button
          className={styles.viewPassword}
          onClick={() => {
            setSelectedItemId(id);
            setViewPasswordVisible(true);
          }}
        >
          View
        </button>
      ),
      checked: true,
    },
  ], []);
  const selectedItem = useMemo(() => {
    if (selectedItemId) {
      return data.find((item) => item.id === selectedItemId) || {};
    }

    return {};
  }, [selectedItemId]);

  const onEditItem = (id) => {
    setSelectedItemId(id);
    setCreateEditKioskVisible(true);
  };
  const onDeleteItem = (id) => {
    setSelectedItemId(id);
    setDeleteKioskVisible(true);
  };
  const handleCloseDialog = () => {
    if (viewPasswordVisible) {
      setViewPasswordVisible(false);
    }
    if (createEditKioskVisible) {
      setCreateEditKioskVisible(false);
    }
    if (selectedItemId) {
      setSelectedItemId(false);
    }
    if (deleteKioskVisible) {
      setDeleteKioskVisible(false);
    }
  };
  const handleSubmitChangePassword = (values) => {
    console.log('values', values);
    handleCloseDialog();
  };
  const handleSubmitItem = (values) => {
    console.log('values', values);
    handleCloseDialog();
  };
  const handleConfirmRemoveItem = () => {
    handleCloseDialog();
  };

  // eslint-disable-next-line no-shadow
  const sorting = useCallback((employees, { field, asc }) => {
    const sortNumFunction = (a, b) => (asc ? (a[field] - b[field]) : (b[field] - a[field]));
    const sortFunction = (a, b) => {
      if (field === 'cost' || field === 'sallary') {
        return sortNumFunction(a.profitability, b.profitability);
      }
      if (typeof a[field] === 'number' && typeof b[field] === 'number') {
        return sortNumFunction(a, b);
      }
      if (typeof a[field] === 'object' || typeof b[field] === 'object') {
        return sortNumFunction(a, b);
      }
      if (asc) {
        return a[field].toString().localeCompare(b[field]);
      }
      return b[field].toString().localeCompare(a[field]);
    };
    return employees.sort(sortFunction);
  }, []);

  return (
    <MainLayout>
      <Dashboard withoutScroll>
        <TitleBlock title={t('Kiosk list')}>
          <Kiosk2Icon />
        </TitleBlock>
        <PageLayout>
          <div className={styles.header}>
            <div className={styles.header__left}>
              <Label
                shrink
                htmlFor='place-select'
                labelId='place-select'
                className={styles.header__left__label}
                text={t('Filter by place')}
              />
              <InputSelect
                id='place-select'
                labelId='v'
                name='country'
                value=''
                onChange={() => {}}
                options={allPlaces}
                valueKey='id'
                labelKey='name'
              />
            </div>
            <Button
              onClick={() => setCreateEditKioskVisible(true)}
              white
              fillWidth
              size='big'
            >
              {t('Create new kiosk')}
            </Button>
          </div>
          <div className={styles.subTitle}>
            {t('Kiosk list')}
            <Tooltip title='Kiosk list' />
          </div>
          <DataTable
            data={data}
            columns={columns || []}
            // columnsWidth={columnsWidthArray || {}}
            sortable
            onSort={(field, asc) => sorting(data, { field, asc })}
            handlePagination={console.log}
            selectedItem=''
            verticalOffset='420px'
            simpleTable
            withoutFilterColumns
            hoverActions
            // loading={loading}
            editRow={onEditItem}
            removeRow={onDeleteItem}
            grey
          />
          <div className={styles.footer}>
            <StyledCheckbox
              // id={id}
              label={t('Request photo to be taken on Clock In through the Kiosk')}
              // checked={!!isDefault}
              // onChange={onChangeCheckbox}
            />
            <StyledCheckbox
              // id={id}
              label={t('Request photo to be taken on Clock Out through the Kiosk')}
              // checked={!!isDefault}
              // onChange={onChangeCheckbox}
            />
          </div>
          <DialogEditPasswordKiosk
            open={viewPasswordVisible}
            handleClose={handleCloseDialog}
            title={`${selectedItem.name} ${t('password')}`}
            currentPassword={selectedItem?.password}
            security={security}
            onSubmit={handleSubmitChangePassword}
          />
          <DialogCreateKiosk
            open={createEditKioskVisible}
            handleClose={handleCloseDialog}
            places={allPlaces}
            onSubmit={handleSubmitItem}
            security={security}
            initialValues={selectedItem}
          />
          <DeleteItem
            open={deleteKioskVisible}
            handleClose={handleCloseDialog}
            title={t('Delete kiosk')}
            description={selectedItem?.name}
            onConfirmRemove={handleConfirmRemoveItem}
          />
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
            key='rigth'
          />
        </PageLayout>
      </Dashboard>
    </MainLayout>
  );
};
