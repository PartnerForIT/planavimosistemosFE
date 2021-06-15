import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
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
  countriesSelector,
  companiesSelector,
  statsSelector,
  isLoadingSelector,
} from '../../store/organizationList/selectors';
import DeleteConfirmation from '../Core/Dialog/DeleteConfirmation';
import DataTable from '../Core/DataTableCustom/OLT';
import routes from '../../config/routes';

const columns = [
  { label: 'ID', field: 'id', checked: true },
  { label: 'Status', field: 'status', checked: true },
  { label: 'Organizations', field: 'name', checked: true },
  { label: 'Users Amount', field: 'employee_count', checked: true },
  { label: 'Email', field: 'contact_person_email', checked: true },
  { label: 'Contact person', field: 'contact_person_name', checked: true },
  { label: 'Active Since', field: 'created_at', checked: true },
  { label: 'Suspended Date', field: 'suspended_at', checked: true },
  { label: 'Closed Data', field: 'deleted_at', checked: true },
  { label: 'Country', field: 'country', checked: true },
  { label: 'Timezone', field: 'timezone', checked: true },
];

const columnsWidthArray = {
  id: 90,
  status: 90,
  name: 200,
  employee_count: 150,
  contact_person_email: 200,
  contact_person_name: 200,
  deleted_at: 200,
  suspended_at: 200,
  created_at: 200,
  country: 150,
  timezone: 120,
};

const page = {};

export default function OrganizationList() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [inputValues, setInputValues] = useState({
    country: '',
    lang: 'EN',
    name: '',
    external_id: '',
    contact_person_name: '',
    contact_person_email: '',
    timezone: 'UTC+00:00',
  });
  const [organizations, SetOrganizations] = useState(3);
  const nameItems = useRef(null);
  // table
  const [columnsArray, setColumnsArray] = useState(columns);
  const [loading, setLoading] = useState(null);
  const [itemsArray, setItemsArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalDuration] = useState(null);

  const countries = useSelector(countriesSelector);
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
      created_at: item.created_at ? moment(item.created_at).format('lll') : '',
      suspended_at: item.suspended_at ? moment(item.suspended_at).format('lll') : '',
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
  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
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
      company: (checkedItems.join()) || `${selectedItem.id}`,
    };

    if (status === 'destroy') {
      setOpenDeleteConfirm(true);

      const names = checkedItems.reduce((acc, item) => {
        const foundItem = itemsArray.find((itemJ) => (itemJ.id === item));
        if (acc) {
          return `${acc}, ${foundItem.name}`;
        }

        return `${foundItem.name}`;
      }, '');
      nameItems.current = names || selectedItem?.name;
    } else {
      clearCheckbox();
      dispatch(postChangeOfStatus(data));
    }
  };
  const handleDeleteConfirm = () => {
    const data = {
      action: 'destroy',
      company: (checkedItems.join()) || `${selectedItem.id}`,
    };
    clearCheckbox();
    dispatch(postChangeOfStatus(data));
    setOpenDeleteConfirm(false);
  };

  // Push to Company
  const enterOrganization = () => {
    setItemsArray((prevState) => prevState.map((item) => ({
      ...item,
      checked: false,
    })));
    setCheckedItems([]);
    // history.push({pathname: routes.COMPANY, state: {company_id: checkedItems[0]}});
    const win = window.open(`${routes.COMPANY}/${checkedItems[0] || selectedItem?.id}`, '_blank');
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
          clearCheckbox={clearCheckbox}
          selectedItem={selectedItem}
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
        <DeleteConfirmation
          open={openDeleteConfirm}
          handleClose={handleCloseDeleteConfirm}
          onDelete={handleDeleteConfirm}
          description={t('confirmation_delete', { name: nameItems.current })}
          title={t('Delete confirmation')}
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
          accountList
        />
      </PageLayout>
    </MaynLayout>
  );
}
