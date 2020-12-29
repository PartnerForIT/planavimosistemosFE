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
import { sendImportedEmployees, showSnackbar } from '../../../../store/settings/actions';

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
  }, {
    label: 'Surname',
    field: 'surname',
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
];

const order = [
  'status', 'name', 'surname', 'role', 'email', 'skill', 'group', 'subgroup', 'place',
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
  groups = [],
  skills = [],
  roles = [],
  places = [],
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [importSuccess, setImportSuccess] = useState(false);

  const selectionHandler = (itemId, value) => {
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
    if (file) {
      const mappedFile = file
        ?.filter((item) => item.data.length)
        .map((emp, index) => {
          const temp = {
            id: index,
          };

          if (emp.errors.length || emp.data.length !== order.length) {
            emp.data.forEach((field, idx) => {
              temp[order[idx]] = field;
            });
            temp.error = true;
            return temp;
          }
          if (!emp.errors.length) {
            if (emp.data.length && order.length) {
              emp.data.forEach((field, idx) => {
                temp[order[idx]] = field;
                if (!field.trim()) {
                  temp.warning = true;
                }
              });
              return temp;
            }
          }
          return emp;
        });
      setData(mappedFile ?? null);
    }
  }, [file]);

  useEffect(() => {
    if (fileName) {
      if (fileName.split('.').pop() !== 'csv') {
        dispatch(showSnackbar(t('Only CSV files are supported.'), 'error'));
        setTempFile(null);
        setFileName('');
      }
    }
  }, [dispatch, fileName, t, tempFile]);

  const fakeUpload = () => {
    if (tempFile) {
      if (fileName.split('.').pop() === 'csv') {
        setFile(tempFile);
      }
    }
  };

  useEffect(() => {

  }, []);

  const importHandler = () => {
    const users = data
      .filter((item) => selectedItems.some((i) => i === item.id))
      .map(({
        id, warning, error, checked, // ~> not used when importing on the backend
        group, subgroup, skill, place, role,
        ...rest
      }) => {
        const userGroup = groups.find((gr) => gr.name === group && gr.subgroups.some(({ name }) => name === subgroup));
        const userSubgroup = userGroup?.subgroups.find(({ name }) => name === subgroup);
        const roleId = roles.find(({ name }) => name === role)?.id;
        const skillId = skills.find(({ name }) => name === skill)?.id;
        const placeId = places.find(({ label }) => label === place)?.id;

        return {
          subgroup: userSubgroup?.id,
          group: userGroup?.id,
          skill: skillId,
          role: roleId,
          place: placeId,
          ...rest,
        };
      });

    dispatch(sendImportedEmployees(companyId, users));
  };

  const handleCloseHandler = () => {
    handleClose();
    setTempFile(null);
    setFile(null);
    setFileName('');
    setData([]);
    setSelectedItems([]);
    setIgnoreEmpty(false);
    setCreateMissing(true);
    clearImported();
  };

  return (
    <Dialog
      handleClose={handleCloseHandler}
      open={open}
      title={title}
    >
      <div className={classes.inner}>

        {/* import CSV */}
        <div className={style.formControl}>
          <Label htmlFor='text' text={t('Company name')} />
          <div className={classes.import}>
            <Input type='text' fullWidth disabled value={fileName} />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className={classes.upload}>
              <FancyInput
                setFileName={setFileName}
                setFile={setTempFile}
                setBackgroundColor={setBackgroundColor}
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
            <p>{`${t('status')};${t('name')};${t('surname')};${t('role')};${t('email')};${t('skill')};${t('group')};${t('sub-group')};${t('assigned_place')};`}</p>
            <span>
              {t('EXAMPLE')}
              {':'}
            </span>
            {' '}
            {`${t('active')};John;Doe;${t('manager')};example@email.com;${t('test') + t('group')};${t('test') + t('subgroup') + t('name')};${t('Test') + t('Place')};`}
          </div>
        </div>

        <div className={classnames(style.formControl, classes.importTable)}>
          <DataTable
            data={data}
            columns={columns ?? []}
            verticalOffset='55vh'
            selectable
            onColumnsChange={() => ({})}
            selectedItem={{}}
            setSelectedItem={() => ({})}
            onSelect={selectionHandler}
            colored={{ warning: !ignoreEmpty, error: true }}
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
              onChange={() => setIgnoreEmpty((prevState) => !prevState)}
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
                  : `${imported?.success} ${t('from')} ${imported?.total} ${t('entries has been imported')}`
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
