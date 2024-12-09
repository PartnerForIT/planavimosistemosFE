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
import classes from './ImportAccounts.module.scss';
import Label from '../../InputLabel';
import DataTable from '../../DataTableCustom/OLT';
import StyledCheckbox from '../../Checkbox/Checkbox';
import OverView from './OverView';
import FancyInput from './FancyInput';
import { isShowSnackbar, snackbarText, snackbarType } from '../../../../store/settings/selectors';
import { loadEmployeesAll, sendImportedEmployees, showSnackbar } from '../../../../store/settings/actions';
import Progress from '../../Progress';

const columns = [

  {
    label: 'Status',
    field: 'status',
    checked: true,
  },
  {
    label: 'Name',
    field: 'name',
    checked: true,
  },
  {
    label: 'Surname',
    field: 'surname',
    checked: true,
  },
  {
    label: 'External ID',
    field: 'external_id',
    checked: true,
  },
  {
    label: 'Employee Status',
    field: 'em_status',
    checked: true,
  },
  {
    label: 'Role',
    field: 'role',
    checked: true,
  },
  {
    label: 'Email',
    field: 'email',
    checked: true,
  },
  {
    label: 'Skill',
    field: 'skill',
    checked: true,
  },
  {
    label: 'Group',
    field: 'group',
    checked: true,
  },
  {
    label: 'Sub-group',
    field: 'subgroup',
    checked: true,
  },
  {
    label: 'Assigned Place',
    field: 'place',
    checked: true,
  },
  {
    label: 'Cost',
    field: 'cost',
    checked: true,
  },
  {
    label: 'Kiosk',
    field: 'kiosk',
    checked: true,
  },
];

const columnsWidth = {
  status: 120,
  name: 200,
  external_id: 120,
  em_status: 100,
  place: 150,
  skills: 200,
  role: 150,
  email: 250,
  groups: 150,
  subgroup: 150,
  cost: 80,
  kiosk: 80,
};
const order = [
  'status', 'name', 'surname', 'external_id', 'em_status', 'role', 'email', 'skill', 'group', 'subgroup', 'place', 'cost', 'kiosk',
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

export default function ImportAccounts({
  handleClose,
  title,
  open,
  imported,
  clearImported,
  employees = [],
  loading = false,
}) {
  const { t } = useTranslation();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { id: companyId } = useParams();

  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const isSnackbar = useSelector(isShowSnackbar);

  const [fileName, setFileName] = useState('');
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState();

  const [ignoreEmpty, setIgnoreEmpty] = useState(false);
  const [createMissing, setCreateMissing] = useState(true);
  const [updateCurrent, setUpdateCurrent] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [all, setAll] = useState(false);

  const clearData = () => {
    setTempFile(null);
    setFile(null);
    setFileName('');
    setData([]);
    setSelectedItems([]);
    setIgnoreEmpty(false);
    setCreateMissing(true);
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
            temp.warning = true;
            return temp;
          }

          emp.data.forEach((field, idx) => {
            temp[order[idx]] = field;
            if (!field.trim()) {
              temp.warning = true;
            }
          });

          if (employees.some(({ email }) => email === temp.email) && !updateCurrent) {
            temp.success = true;
          }

          return temp;
        });
      setData(mappedFile ?? null);
    }
    // eslint-disable-next-line
  }, [dispatch, employees, file, t]);

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
    const { users } = imported;
    if (importSuccess) {
      if (selectedItems.length) {
        if (Array.isArray(users)) {
          setData((prevState) => prevState.map(({
            id, email, error, success, ...rest
          }) => {
            if (selectedItems.some((i) => i === id)) {
              const suc = users.some(({ user }) => user.email === email);
              return {
                id,
                email,
                ...rest,
                // eslint-disable-next-line no-nested-ternary
                error: !suc,
                success: suc && !updateCurrent,
              };
            }

            return {
              id, success, email, ...rest,
            };
          }));
        } else {
          setData((prevState) => prevState.map(({ id, ...rest }) => ({ id, ...rest, error: !!selectedItems.some((i) => i === id) })));
        }
      }
    }
  }, [importSuccess, updateCurrent, imported, imported.users, selectedItems, selectedItems.length]);

  const fakeUpload = () => {
    if (tempFile) {
      if (fileName?.split('.').pop() === 'csv') {
        setFile(tempFile);
        setTempFile(null);
      }
    }
  };

  const getCheckedItems = (items) => items.filter(({ warning, success, error }) => {
    if (error || success) {
      return false;
    }
    if (warning && ignoreEmpty) {
      return true;
    }
    return !warning;
  }).map(({ id }) => id);
  const selectAllHandler = (items = []) => {
    const value = items.length;
    const checkedItems = getCheckedItems(items);

    setData(data.map(({
      warning, error, success, checked, ...rest
    }) => {
      let check = !!value;

      if ((success && !updateCurrent) || (!ignoreEmpty && warning)) {
        check = false;
      }

      return {
        ...rest,
        warning,
        error,
        success,
        checked: check,
      };
    }));

    setSelectedItems(checkedItems);
    setIsAllSelected(!!value);
  };

  const importHandler = () => {
    const users = data
      .filter((item) => selectedItems.some((i) => i === item.id))
      .map(({
        id, warning, error, checked, success, // ~> not used when importing on the backend
        status, ...rest
      }) => {
        const statusId = () => {
          switch (status.toLowerCase()) {
            case 'active':
              return 1;
            case 'suspended':
              return 0;
            case 'delete':
              return 2;
            default:
              return 0;
          }
        };

        return {
          status: statusId(),
          ...rest,
        };
      });

    dispatch(sendImportedEmployees(companyId, { users, createMissing: createMissing ? 1 : 0, updateCurrent: updateCurrent ? 1 : 0 }));
  };

  const handleCloseHandler = () => {
    handleClose();
    clearData();
    clearImported();
    if (!_.isEmpty(imported)) {
      dispatch(loadEmployeesAll(companyId));
    }
  };

  const handleChangeIgnoreEmpty = () => {
    const nextIgnoreEmpty = !ignoreEmpty;
    setIgnoreEmpty(nextIgnoreEmpty);
    updateData(nextIgnoreEmpty, updateCurrent);
  };

  const handleChangeUpdateCurrent = () => {
    const nextUpdateCurrent = !updateCurrent;
    setUpdateCurrent(nextUpdateCurrent);
    updateData(ignoreEmpty, nextUpdateCurrent);
  };

  const updateData = (empty, current) => {
    setData((prevState) => {
      let nextState = prevState.map((item) => {
        const warning = empty
          ? !(item.email && item.name && item.surname)
          : !(item.group && item.subgroup && item.place && item.role && item.skill);

        const success = (employees.some(({ email }) => email === item.email) && !current);

        return {
          ...item,
          warning,
          success: success,
        };
      });

      if (isAllSelected) {
        const checkedItems = getCheckedItems(nextState);

        nextState = nextState.map(({
          warning,
          error,
          success,
          checked,
          ...rest
        }) => {
          let check = checked;
          if ((success && !current) || (!empty && warning)) {
            check = false;
          }

          return {
            ...rest,
            warning,
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
            <p>{`${t('status')};${t('name')};${t('surname')};${t('external_id')};${t('employment_status')};${t('role')};${t('email')};${t('skill')};${t('group')};${t('sub-group')};${t('assigned_place')};${t('cost')};${t('kiosk')};`}</p>
            <span>
              {t('EXAMPLE')}
              {':'}
            </span>
            {' '}
            {`${t('active')};John;Doe;${t('123456')};${t('0.5')};${t('manager')};example@email.com;${t('test') + t('skill')};${t('test') + t('group')};${t('test') + t('subgroup') + t('name')};${t('Test') + t('Place')};${t('11,4')};${t('yes')};`}
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
            colored={{ warning: true, error: true, success: true }}
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
              label={t('Create missing Role, Skill, Group, Sub-Group, Place')}
              checked={createMissing}
              onChange={() => setCreateMissing((prevState) => !prevState)}
            />
            <StyledCheckbox
              label={t('Ignore empty values')}
              checked={ignoreEmpty}
              onChange={handleChangeIgnoreEmpty}
            />
            <StyledCheckbox
              label={t('Update current accounts')}
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
