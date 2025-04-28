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
import {
  kiosksLoadingSelector,
  kiosksSelector,
  settingsPhotoTakeLoadingSelector,
  settingsPhotoTakeSelector,
} from '../../../../store/kiosks/selectors';
import StyledCheckbox from '../../../Core/Checkbox/Checkbox';
import DialogCreateKiosk from '../../../Core/Dialog/CreateKiosk';
import DialogEditPasswordKiosk from '../../../Core/Dialog/EditPasswordKiosk';
import DeleteItem from '../../../Core/Dialog/DeleteItem';
import Tooltip from '../../../Core/Tooltip';
import Progress from '../../../Core/Progress';
import { placesSelector } from '../../../../store/places/selectors';
import { getPlaces } from '../../../../store/places/actions';
import {
  getKiosks,
  postKiosk,
  patchKiosk,
  deleteKiosk,
  getSettingsPhotoTake,
  postSettingsPhotoTake,
  postKioskChangePassword,
} from '../../../../store/kiosks/actions';
import styles from './KioskList.module.scss';

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

  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = t(useSelector(snackbarText));
  const security = useSelector(securityCompanySelector);
  const places = useSelector(placesSelector);
  const kiosksLoading = useSelector(kiosksLoadingSelector);
  const kiosks = useSelector(kiosksSelector);
  const settingsPhotoTakeLoading = useSelector(settingsPhotoTakeLoadingSelector);
  const settingsPhotoTake = useSelector(settingsPhotoTakeSelector);

  const [selectedItemId, setSelectedItemId] = useState('');
  const [deleteKioskVisible, setDeleteKioskVisible] = useState(false);
  const [viewPasswordVisible, setViewPasswordVisible] = useState(false);
  const [createEditKioskVisible, setCreateEditKioskVisible] = useState(false);
  const [settingsValues, setSettingsValues] = useState({ take_in: false, take_out: false, disable_break: false, disable_cost: false });
  const [filterPlace, setFilterPlace] = useState('allPlaces');

  const columns = useMemo(() => [
    { label: 'Kiosk name', field: 'name', checked: true },
    { label: 'Assigned to place', field: 'place_name', checked: true },
    { label: 'Kiosk admin user', field: 'user_name', checked: true },
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
      return kiosks.find((item) => item.id === selectedItemId) || {};
    }

    return {};
  }, [kiosks, selectedItemId]);
  const optionsPlaces = useMemo(() => [
    {
      id: 'allPlaces',
      name: t('All places'),
    },
    ...places,
  ], [places, t]);

  // allPlaces
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
      setSelectedItemId('');
    }
    if (deleteKioskVisible) {
      setDeleteKioskVisible(false);
    }
  };
  const handleSubmitChangePassword = (values) => {
    dispatch(postKioskChangePassword(companyId, selectedItem.id, { password: values.password }));
    handleCloseDialog();
  };
  const handleSubmit = (values) => {
    if (selectedItem.id) {
      dispatch(patchKiosk(companyId, selectedItem.id, values));
    } else {
      dispatch(postKiosk(companyId, values));
    }

    handleCloseDialog();
  };
  const handleConfirmRemove = () => {
    dispatch(deleteKiosk(companyId, selectedItem.id));
    handleCloseDialog();
  };
  const handleChangeCheckbox = (id) => {
    setSettingsValues((prevState) => {
      dispatch(postSettingsPhotoTake(
        companyId,
        (id === 'disable_break' || id === 'disable_cost') ? id : (id === 'take_in' ? 'in' : 'out'),
        !prevState[id] ? 'on' : 'off',
      ));
      return {
        ...prevState,
        [id]: !prevState[id],
      };
    });
  };
  const handleChangePlace = (event) => {
    setFilterPlace(event.target.value);
  };

  // eslint-disable-next-line no-shadow
  const sorting = useCallback((data, { field, asc }) => {
    const sortNumFunction = (a, b) => (asc ? (a[field] - b[field]) : (b[field] - a[field]));
    const sortFunction = (a, b) => {
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
    return data.sort(sortFunction);
  }, []);

  useEffect(() => {
    dispatch(getPlaces(companyId));
    dispatch(getSettingsPhotoTake(companyId));
  }, [dispatch, companyId]);
  useEffect(() => {
    if (filterPlace !== 'allPlaces') {
      dispatch(getKiosks(companyId, filterPlace));
    } else {
      dispatch(getKiosks(companyId));
    }
  }, [dispatch, companyId, filterPlace]);
  useEffect(() => {
    if (settingsPhotoTake) {
      setSettingsValues({
        take_in: !!settingsPhotoTake.take_in,
        take_out: !!settingsPhotoTake.take_out,
        disable_break: !!settingsPhotoTake.disable_break,
        disable_cost: !!settingsPhotoTake.disable_cost,
      });
    }
  }, [settingsPhotoTake]);

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
                labelId='country'
                name='country'
                value={filterPlace}
                onChange={handleChangePlace}
                options={optionsPlaces}
                valueKey='id'
                labelKey='name'
              />
            </div>
            <Button
              onClick={() => { setSelectedItemId(''); setCreateEditKioskVisible(true) }}
              white
              fillWidth
              size='big'
            >
              {t('Create new kiosk')}
            </Button>
          </div>
          <div className={styles.subTitle}>
            {t('Kiosk list')}
            <Tooltip title={t('Kiosk list')} />
          </div>
          <DataTable
            data={kiosks}
            columns={columns || []}
            // columnsWidth={columnsWidthArray || {}}
            sortable
            onSort={(field, asc) => sorting(kiosks, { field, asc })}
            handlePagination={Function.prototype}
            selectedItem=''
            verticalOffset='70vh'
            simpleTable
            withoutFilterColumns
            hoverActions
            loading={kiosksLoading}
            editRow={onEditItem}
            removeRow={onDeleteItem}
            grey
          />
          <div className={styles.footer}>
            <div>
              <StyledCheckbox
                id='take_in'
                label={t('Request photo to be taken on Clock In through the Kiosk')}
                checked={settingsValues.take_in}
                onChange={handleChangeCheckbox}
              />
              <StyledCheckbox
                id='take_out'
                label={t('Request photo to be taken on Clock Out through the Kiosk')}
                checked={settingsValues.take_out}
                onChange={handleChangeCheckbox}
              />
              {
                settingsPhotoTakeLoading && (
                  <div className={styles.footer__loader}>
                    <Progress />
                  </div>
                )
              }
            </div>
            <div>
              <StyledCheckbox
                id='disable_break'
                label={t('Disable Break In Kiosk')}
                checked={settingsValues.disable_break}
                onChange={handleChangeCheckbox}
              />
              <StyledCheckbox
                id='disable_cost'
                label={t('Disable Costs In Kiosk (Finishing Job Screen)')}
                checked={settingsValues.disable_cost}
                onChange={handleChangeCheckbox}
              />
            </div>
          </div>
          <Tooltip title={t('Kiosk settings - in order to apply these Kiosk settings please re-login in your tablet within Grownu Mobile APP with the correct Kiosk admin user and password.')} />
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
            places={places}
            onSubmit={handleSubmit}
            security={security}
            initialValues={selectedItem}
          />
          <DeleteItem
            open={deleteKioskVisible}
            handleClose={handleCloseDialog}
            title={t('Delete kiosks')}
            description={selectedItem?.name}
            onConfirmRemove={handleConfirmRemove}
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
