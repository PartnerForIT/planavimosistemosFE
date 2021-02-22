import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import MaynLayout from '../Core/MainLayout';
import PageLayout from '../Core/PageLayout';
import TitleBlock from '../Core/TitleBlock';
import Filter from './Filter';
import AddNewOrganization from '../Core/Dialog/AddNewOrganization';
import PeopleIcon from '../Icons/2Peple';
import {
  getCountries, addOrganization, getCompanies, postChangeOfStatus,
} from '../../store/organizationList/actions';
import {
  countriesSelector, isShowSnackbar, snackbarType, snackbarText,
  companiesSelector, statsSelector, isLoadingSelector,
} from '../../store/organizationList/selectors';
import DataTable from '../Core/DataTableCustom/OLT';
import routes from '../../config/routes';

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

const columns = [
  { label: 'status', field: 'status', checked: true },
  { label: 'Organizations', field: 'name', checked: true },
  { label: 'Email', field: 'contact_person_email', checked: true },
  { label: 'Contact person', field: 'contact_person_name', checked: true },
  { label: 'Closed Data', field: 'deleted_at', checked: true },
  { label: 'Country', field: 'country', checked: true },
  { label: 'Timezone', field: 'timezone', checked: true },
];

const columnsWidthArray = {
  status: 80,
  name: 200,
  contact_person_email: 200,
  contact_person_name: 200,
  deleted_at: 200,
  country: 150,
  timezones: 120,
};

const page = {};

export default function OrganizationList() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [inputValues, setInputValues] = useState({
    country: 'PL',
    lang: 'EN',
    name: '',
    external_id: '',
    contact_person_name: '',
    contact_person_email: '',
    timezone: 'UTC+00:00',
  });
  const [organizations, SetOrganizations] = useState(3);
  // table
  const [columnsArray, setColumnsArray] = useState(columns);
  const [loading, setLoading] = useState(null);
  const [itemsArray, setItemsArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalDuration] = useState(null);

  const countries = useSelector(countriesSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const companies = useSelector(companiesSelector);
  const stats = useSelector(statsSelector);
  const isLoading = useSelector(isLoadingSelector);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (organizations === 3) {
      dispatch(getCompanies());
    } else {
      dispatch(getCompanies({ status: organizations }));
    }
  }, [dispatch, organizations]);

  const nameCountry = useCallback((row) => {
    const name = countries.filter((item) => item.code === row.country);
    return name[0] ? name[0].name : '';
  }, [countries]);

  useEffect(() => {
    setItemsArray(companies.map((item) => ({
      ...item,
      checked: false,
      updated_at: item.updated_at ? moment(item.updated_at).format('lll') : '',
      deleted_at: item.deleted_at ? moment(item.deleted_at).format('lll') : '',
      country: nameCountry(item),
    })));
  }, [companies, nameCountry]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const rowSelectionHandler = (selectedRow) => {
    setSelectedItem(selectedRow);
  };

  const selectionHandler = (itemId, value) => {
    setItemsArray((prevState) => prevState.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          checked: !item.checked,
        };
      }
      return item;
    }));
    if (value) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      const index = checkedItems.indexOf(itemId);
      checkedItems.splice(index, 1);
      setCheckedItems([...checkedItems]);
    }
  };

  const sortHandler = useCallback((field, asc) => {
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
    const sortItems = (array) => {
      const arrayCopy = [...array];
      arrayCopy.sort(sortFunction);
      return arrayCopy;
    };
    setItemsArray(sortItems);
  }, []);
  // --table--

  const handleChangeOrganizations = (e) => {
    const { value } = e.target;
    SetOrganizations(parseInt(value, 10));
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setInputValues({
      country: 'PL',
      lang: 'EN',
      name: '',
      external_id: '',
      contact_person_name: '',
      contact_person_email: '',
      timezone: 'UTC+00:00',
    });
  };

  // Add new organization
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
    if (name === 'country') {
      const selectCounry = countries.filter((item) => item.code === value);
      setInputValues({
        ...inputValues,
        timezone: selectCounry[0].timezones[0],
        country: selectCounry[0].code,
      });
    }
  };

  const saveOrg = () => {
    dispatch(addOrganization(inputValues));
    setInputValues({
      country: 'PL',
      lang: 'EN',
      name: '',
      external_id: '',
      contact_person_name: '',
      contact_person_email: '',
      timezone: 'UTC+00:00',
    });
    setOpen(false);
  };

  const clearCheckbox = () => {
    setItemsArray((prevState) => prevState.map((item) => ({
      ...item,
      checked: false,
    })));
    setCheckedItems([]);
  };

  // Change Status Organizations
  const changeStatusCompany = (status) => {
    const data = {
      action: status,
      company: (checkedItems.join()),
    };
    clearCheckbox();
    dispatch(postChangeOfStatus(data));
  };

  // Push to Company
  const enterOrganization = () => {
    setItemsArray((prevState) => prevState.map((item) => ({
      ...item,
      checked: false,
    })));
    setCheckedItems([]);
    // history.push({pathname: routes.COMPANY, state: {company_id: checkedItems[0]}});
    const win = window.open(`${routes.COMPANY}/${checkedItems[0]}`, '_blank');
    win.focus();
  };

  return (
    <MaynLayout>
      <TitleBlock
        title='Organization list'
        info={stats}
        TitleButtonNew='New Organisation'
        handleButtonNew={handleClickOpen}
      >
        <PeopleIcon />
      </TitleBlock>
      <PageLayout>
        <Filter
          handleChangeOrganizations={handleChangeOrganizations}
          organizations={organizations}
          changeStatusCompany={changeStatusCompany}
          checkedItems={checkedItems}
          enterOrganization={enterOrganization}
          companies={companies}
          clearCheckbox={clearCheckbox}
        />
        <AddNewOrganization
          open={open}
          handleClose={handleClose}
          title='Add new organization'
          inputValues={inputValues}
          countries={countries}
          handleInputChange={handleInputChange}
          saveOrg={saveOrg}
        />

        <DataTable
          data={itemsArray || []}
          columns={columnsArray || []}
          columnsWidth={columnsWidthArray || {}}
          onColumnsChange={setColumnsArray}
          selectable
          sortable
          loading={loading}
          onSelect={selectionHandler}
          onSort={sortHandler}
          // onSerach={searchHandler}
          lastPage={page.last_page}
          activePage={page.current_page}
          itemsCountPerPage={page.per_page}
          totalItemsCount={page.total}
          handlePagination={console.log}
          selectedItem={selectedItem}
          totalDuration={totalDuration}
          setSelectedItem={rowSelectionHandler}
          verticalOffset='300px'
        />
      </PageLayout>

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
    </MaynLayout>
  );
}
