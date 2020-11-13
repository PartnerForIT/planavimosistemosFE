import React, {useState, useEffect, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import MaynLayout from '../Core/MainLayout';
import PageLayout from '../Core/PageLayout';
import TitleBlock from '../Core/TitleBlock';
import Filter from "./Filter";
import AddNewOrganization from '../Core/Dialog/AddNewOrganization'
import PeopleIcon from '../Icons/2Peple';
import {getCountries, addOrganization, getCompanies} from '../../store/organizationList/actions';
import {countriesSelector, isShowSnackbar, snackbarType, snackbarText,
  companiesSelector, statsSelector} from '../../store/organizationList/selectors';
import Snackbar from '@material-ui/core/Snackbar';
import DataTable from '../Core/DataTableCustom/OLT';

const useStyles = makeStyles(() => ({
  error: {
    background: '#de4343',
    color: "#fff",
  },
  success: {
    background: '#3bc39e',
    color: "#fff",
  }
}));

const columns =[
  {label: "status", field: 'status', checked: true },
  {label: "Organizations", field: 'name', checked: true },
  {label: "Email", field: 'contact_person_email', checked: true},
  {label: "Contact person", field: 'contact_person_name', checked: true},
  {label: "Closed Data", field: 'deleted_at', checked: true},
  {label: "Country", field: 'country', checked: true},
];
  
 const columnsWidthArray = {
  status: 80,
  name: 200,
  contact_person_email: 200,
  contact_person_name: 200,
  deleted_at: 200,
  country: 200,
 };

 const page={};

export default function OrganizationList() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [inputValues, setInputValues] = useState({
    country: 'PL', 
    lang: 'EN', 
    name: '', 
    external_id: '', 
    contact_person_name: '', 
    contact_person_email: ''
  });
  const [organizations, SetOrganizations] = useState(3);
  
  const dispatch = useDispatch();
  const countries = useSelector(countriesSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const companies = useSelector(companiesSelector);
  const stats = useSelector(statsSelector)
 
  useEffect(() => {
    dispatch(getCountries());
    dispatch(getCompanies({status: organizations}));
  },[]);

  useEffect(()=> {
    dispatch(getCompanies({status: organizations}));
  },[organizations])

  useEffect(() => {
    companies.map(item => {
      item.checked = false
    })
    setItemsArray(companies);
  }, [companies]);

  //table 
  const [columnsArray, setColumnsArray] = useState(columns);
  const [loading, setLoading] = useState(null);
  const [itemsArray, setItemsArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalDuration, setTotalDuration] = useState(null);

  const rowSelectionHandler = (selectedRow) => {
    setSelectedItem(selectedRow);
  };

  const selectionHandler = (itemId, value) => {
    companies.map(item => {
        if (item.id === itemId) {
          item.checked = !item.checked ;
        }
      }
    );
    if(value) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      let index = checkedItems.indexOf(itemId);
      checkedItems.splice(index, 1)
      setCheckedItems([...checkedItems]);
    }
  };

  const searchHandler = useCallback(() => {
    //search
  }, [])
    
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
      return arrayCopy 
    };
    setItemsArray(sortItems);
  }, []);
//--table--
     
  const handleChangeOrganizations = e => {
    const { value } = e.target;
    SetOrganizations(parseInt(value));
  }

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
      contact_person_email: ''
    });
  };    
 // Add new org
  const handleInputChange = event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const saveOrg = () => {
    dispatch(addOrganization(inputValues));
    setInputValues({
      country: 'PL', 
      lang: 'EN', 
      name: '', 
      external_id: '', 
      contact_person_name: '', 
      contact_person_email: ''
    });
    setOpen(false);
  }
        
  return (
    <MaynLayout>
      <TitleBlock  
        title={"Organization list"} 
        info={stats} 
        TitleButtonNew={"New Organisation"} 
        handleButtonNew={handleClickOpen}
      >
      <PeopleIcon />
      </TitleBlock>
      <PageLayout>
        <Filter 
          handleChangeOrganizations={handleChangeOrganizations} 
          organizations={organizations} 
        />
        <AddNewOrganization
        open={open} 
        handleClose={handleClose} 
        title={"Add new organization"}  
        inputValues={inputValues}
        countries={countries}
        handleInputChange={handleInputChange}
        saveOrg={saveOrg}
        />

        <DataTable
          data={ itemsArray|| []}
          columns={columnsArray || []}
          columnsWidth={columnsWidthArray || {}}
          onColumnsChange={setColumnsArray}
          selectable
          sortable
          loading={loading}
          onSelect={selectionHandler}
          onSort={sortHandler}
          onSerach={searchHandler}
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
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          ContentProps={{
            classes: {
                root: typeSnackbar === 'error' ? classes.error : classes.success
            }
          }}
          severity="error"
          open={isSnackbar}
          message={textSnackbar}
          key={"rigth"}
        />
    </MaynLayout>  
  )
}