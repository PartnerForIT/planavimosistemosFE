/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import style from '../Dialog.module.scss';
import classes from './ImportPlaces.module.scss';
import Label from '../../InputLabel';
import DataTable from '../../DataTableCustom/OLT';
import StyledCheckbox from '../../Checkbox/Checkbox';
import OverView from './OverView';
import FancyInput from './FancyInput';
import { isShowSnackbar, snackbarText, snackbarType } from '../../../../store/settings/selectors';
import { sendImportedPlaces, showSnackbar } from '../../../../store/settings/actions';
import { getPlaces } from '../../../../store/places/actions';
import Progress from '../../Progress';

import config from 'config';

import {
  setKey,
  fromAddress,
} from "react-geocode";

const columns = [
  {
    label: 'Action',
    field: 'action',
    checked: true,
  },
  {
    label: 'Name',
    field: 'name',
    checked: true,
  },
  {
    label: 'External ID',
    field: 'external_id',
    checked: true,
  },
  {
    label: 'Geolocation',
    field: 'geolocation',
    checked: true,
  },
  {
    label: 'Radius',
    field: 'radius',
    checked: true,
  },
  {
    label: 'Realtimetracking',
    field: 'realtimetracking',
    checked: true,
  },
];

const columnsWidth = {
  action: 120,
  name: 200,
  external_id: 120,
  geolocation: 280,
  radius: 80,
  realtimetracking: 80,
};
const order = [
  'action', 'name', 'external_id', 'geolocation', 'radius', 'realtimetracking',
];

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

export default function ImportPlaces({
  handleClose,
  title,
  open,
  imported,
  clearImported,
  places = [],
  loading = false,
}) {
  
  const { t } = useTranslation();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { id: companyId } = useParams();

  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = t(useSelector(snackbarText));
  const isSnackbar = useSelector(isShowSnackbar);

  const [fileName, setFileName] = useState('');
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState();

  const [updateCurrent, setUpdateCurrent] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [all, setAll] = useState(false);

  setKey(config.google.key);

  const clearData = () => {
    setTempFile(null);
    setFile(null);
    setFileName('');
    setData([]);
    setSelectedItems([]);
    setImportSuccess(false);
    setUpdateCurrent(false);
  };

  const selectionHandler = (itemId, value, e) => {
    if (typeof e === 'object') {
      setImportSuccess(false);
    }
    // eslint-disable-next-line array-callback-return
    data.forEach((item) => {
      if (item.id === itemId) {
        // eslint-disable-next-line no-param-reassign
        item.checked = !item.checked;
      }
    });
    if (value) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      const index = selectedItems.indexOf(itemId);
      selectedItems.splice(index, 1);
      setSelectedItems([...selectedItems]);
    }
  };

  useEffect(() => {
    if (!_.isEmpty(imported)) {
      setImportSuccess(true);
    } else {
      setImportSuccess(false);
    }
  }, [imported]);

  useEffect(() => {
    if (Array.isArray(file)) {
      const errorIndex = file.findIndex((item) => item.errors?.length);

      if (errorIndex !== -1) {
        const errorRow = file[errorIndex];
        const errors = errorRow?.errors;
        dispatch(showSnackbar(t('An error was found in the CSV file. Only correct CSV file should be loaded.'), 'error'));
        const timeOut = setTimeout(() => {
          dispatch(showSnackbar((`${t('Row')} ${errorIndex}: ${errors[0].message}`), 'error'));
          clearTimeout(timeOut);
        }, 4000);
        clearData();
        return;
      }

      const mappedFile = file
        ?.filter((item) => item.data.length)
        .map((emp, index) => {
          const temp = {
            id: index,
          };
          
          // TODO error on unsuccessful import
          if (emp.data.length !== order.length) {
            emp.data.forEach((field, idx) => {
              temp[order[idx]] = field;
            });
          }

          emp.data.forEach((field, idx) => {
            temp[order[idx]] = field.trim(); 
          });

          if (places.some(({ external_id, name }) => name === temp?.name  && (!temp.external_id || (temp.external_id && external_id === temp?.external_id))) && !updateCurrent) {
            temp.success = true;
          }

          if (temp?.geolocation) {
            fetchCoordinates(temp.geolocation).then((coordinates) => {
              temp.coordinates = coordinates;
            });
          }

          return temp;
        });
      setData(mappedFile ?? null);
    }
    // eslint-disable-next-line
  }, [dispatch, places, file, t]);

  useEffect(() => {
    if (fileName) {
      if (fileName.split('.').pop() !== 'csv') {
        dispatch(showSnackbar(t('Only CSV files are supported.'), 'error'));
        setTempFile(null);
        setFileName('');
      }
    }
  }, [dispatch, fileName, t, tempFile]);

  useEffect(() => {
    const importedPlaces = imported.places;
    if (importSuccess) {
      if (selectedItems.length) {
        if (Array.isArray(importedPlaces)) {
          setData((prevState) => prevState.map(({
            id, name, external_id, error, success, ...rest
          }) => {
            if (selectedItems.some((i) => i === id)) {
              const suc = importedPlaces.some(({ place }) => place?.name === name && (!external_id || (external_id && place?.external_id === external_id)));
              return {
                id,
                name,
                external_id,
                ...rest,
                // eslint-disable-next-line no-nested-ternary
                error: !suc,
                success: suc && !updateCurrent,
              };
            }

            return {
              id, success, name, external_id, ...rest,
            };
          }));
        } else {
          setData((prevState) => prevState.map(({ id, ...rest }) => ({ id, ...rest, error: !!selectedItems.some((i) => i === id) })));
        }
      }
    }
    // eslint-disable-next-line
  }, [importSuccess, updateCurrent, imported, selectedItems, selectedItems.length]);

  const fetchCoordinates = async (address) => {
    try {
      const response = await fromAddress(address);
      const { lat, lng } = response.results[0].geometry.location;
      const coordinates = `${lat},${lng}`;
      
      return coordinates;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return '';
    }
  };

  const fakeUpload = () => {
    if (tempFile) {
      if (fileName?.split('.').pop() === 'csv') {
        setFile(tempFile);
        setTempFile(null);
      }
    }
  };

  const getCheckedItems = (items) => items.filter(({ success, error }) => {
    if (error || success) {
      return false;
    }
    return true;
  }).map(({ id }) => id);
  const selectAllHandler = (items = []) => {
    const value = items.length;
    const checkedItems = getCheckedItems(items);

    setData(data.map(({
      error, success, checked, ...rest
    }) => {
      let check = !!value;

      if ((success && !updateCurrent)) {
        check = false;
      }

      return {
        ...rest,
        error,
        success,
        checked: check,
      };
    }));

    setSelectedItems(checkedItems);
    setIsAllSelected(!!value);
  };

  const importHandler = () => {
    const places = data
      .filter((item) => selectedItems.some((i) => i === item.id))
      .map(({
        id, error, checked, success, // ~> not used when importing on the backend
        ...rest
      }) => {
        return {
          ...rest,
        };
      });

    dispatch(sendImportedPlaces(companyId, { places, updateCurrent: updateCurrent ? 1 : 0 }));
  };

  const handleCloseHandler = () => {
    handleClose();
    clearData();
    clearImported();
    if (!_.isEmpty(imported)) {
      dispatch(getPlaces(companyId));
    }
  };

  const handleChangeUpdateCurrent = () => {
    const nextUpdateCurrent = !updateCurrent;
    setUpdateCurrent(nextUpdateCurrent);
    updateData(nextUpdateCurrent);
  };

  const updateData = (current) => {
    setData((prevState) => {
      let nextState = prevState.map((item) => {

        const suc = (places.some(({ external_id, name }) => name === item?.name  && (!item.external_id || (item.external_id && external_id === item?.external_id))) && !current)

        return {
          ...item,
          success: suc,
        };
      });

      if (isAllSelected) {
        const checkedItems = getCheckedItems(nextState);

        nextState = nextState.map(({
          error,
          success,
          checked,
          ...rest
        }) => {
          let check = checked;
          if ((success && !current)) {
            check = false;
          }

          return {
            ...rest,
            error,
            success: success && !updateCurrent,
            checked: check,
          };
        });

        setSelectedItems(checkedItems);
      }

      return nextState;
    });
  }
  
  return (
    <Dialog
      handleClose={handleCloseHandler}
      open={open}
      title={title}
    >
      <div className={classes.inner}>
        {
        loading
        && (
        <div className={classes.loader}>
          <Progress />
        </div>
        )
        }
        {/* import CSV */}
        <div className={style.formControl}>
          <Label htmlFor='text' text={t('File name')} />
          <div className={classes.import}>
            <Input type='text' fullWidth disabled value={fileName} />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className={classes.upload}>
              <FancyInput
                setFileName={setFileName}
                setFile={setTempFile}
                setBackgroundColor={setBackgroundColor}
                clearData={clearData}
              />
              {t('Select file')}
            </label>

            <Button
              size='medium'
              onClick={fakeUpload}
              disabled={!tempFile || fileName.split('.').pop() !== 'csv'}
            >
              {t('Upload')}
            </Button>
          </div>
        </div>

        {/* Example of CSV file contents */}
        <div className={style.formControl}>
          <Label text={t('Example of CSV file contents')} />
          <div className={classes.textarea} style={{ backgroundColor }}>
            <p>{`${t('action')};${t('name')};${t('external_id')};${t('geolocation')};${t('radius')};${t('realtimetracking')};`}</p>
            <span>
              {t('EXAMPLE')}
              {':'}
            </span>
            {' '}
            {`${t('add')};TestName;${t('123456')};${t('Antakalnio g. 17, 10312, Vilnius, Lithuania')};${t('750')};1;`}
          </div>
        </div>

        <div className={classnames(style.formControl, classes.importTable)}>
          <DataTable
            data={data}
            columns={columns ?? []}
            columnsWidth={columnsWidth}
            verticalOffset='55vh'
            selectable
            onColumnsChange={() => ({})}
            selectedItem={{}}
            setSelectedItem={() => ({})}
            onSelect={selectionHandler}
            colored={{ error: true, success: true }}
            selectAllItems={selectAllHandler}
            all={all}
            setAll={setAll}
            withoutShitCode
          />
          {!data.length && <OverView />}
          {/*   loader? */}
        </div>
        <div className={classnames(style.formControl, classes.importFooter)}>
          <div>
            <StyledCheckbox
              label={t('Update current places')}
              checked={updateCurrent}
              onChange={handleChangeUpdateCurrent}
            />
          </div>
          <div className={classes.importStats}>
            <div
              className={classes.fakeInput}
              style={{ backgroundColor: importSuccess ? '#E6FAE3' : backgroundColor }}
            >
              {
                // eslint-disable-next-line no-nested-ternary
                !importSuccess
                  ? file ? `${selectedItems.length} ${t('entries will be imported')}` : ''
                  : `${imported?.success} ${t('imported')} ${imported?.deleted} ${t('deleted')} ${imported?.updated} ${t('updated')}, ${t('from')} ${imported?.total} ${t('entries')}`
              }
            </div>
            <Button size='big' disabled={!selectedItems.length} onClick={importHandler}>{t('Import')}</Button>
          </div>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        ContentProps={{
          classes: {
            root: typeSnackbar === 'error' ? styles.error : styles.success,
          },
        }}
        severity='error'
        open={isSnackbar}
        message={textSnackbar}
        key='right'
      />
    </Dialog>
  );
}
