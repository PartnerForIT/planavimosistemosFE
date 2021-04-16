import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

import MainLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import Button from '../../../Core/Button/Button';
import Label from '../../../Core/InputLabel';
import InputSelect from '../../../Core/InputSelect';
import DataTable from '../../../Core/DataTableCustom/OLT';
import Kiosk2Icon from '../../../Icons/Kiosk2';
import { isShowSnackbar, snackbarText, snackbarType } from '../../../../store/settings/selectors';
import styles from './KioskList.module.scss';
import StyledCheckbox from '../../../Core/Checkbox/Checkbox';
import DialogCreateKiosk from '../../../Core/Dialog/CreateKiosk';

const columns = [
  { label: 'Kiosk name', field: 'name', checked: true },
  { label: 'Assigned to place', field: 'place', checked: true },
  { label: 'Kiosk admin user', field: 'admin', checked: true },
  { label: 'Password', field: 'password', checked: true },
];

export default () => {
  const { t } = useTranslation();

  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

  const [createKioskVisible, setCreateKioskVisible] = useState(false);

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

  return (
    <MainLayout>
      <Dashboard withoutScroll>
        <TitleBlock
          title={t('Kiosk list')}
          tooltip={t('Kiosk list')}
        >
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
                value={''}
                onChange={() => {}}
                options={[]}
                valueKey='code'
                labelKey='name'
              />
            </div>
            <Button
              onClick={() => {}}
              white
              fillWidth
              size='big'
            >
              {t('Create new kiosk')}
            </Button>
          </div>
          <DataTable
            data={[]}
            columns={columns || []}
            // columnsWidth={columnsWidthArray || {}}
            // onColumnsChange={setColumnsArray}
            sortable
            // onSelect={selectionHandler}
            // onSort={sortHandler}
            handlePagination={console.log}
            // selectedItem={selectedRow}
            // setSelectedItem={setSelectedRow}
            verticalOffset='360px'
            simpleTable
            withoutFilterColumns
            hoverActions
            // loading={loading}
            // editRow={onEditItem}
            // removeRow={onDeleteItem}
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
          <DialogCreateKiosk
            open={createKioskVisible}
            handleClose={() => setCreateKioskVisible(false)}
            title={t('New kiosk')}
            buttonTitle={t('Create Kiosk')}
            // createSkill={createNewSkill}
            // permissions={permissions}
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
