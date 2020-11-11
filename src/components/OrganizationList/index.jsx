import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import MaynLayout from '../Core/MainLayout';
import TitleBlock from '../Core/TitleBlock';
import AddNewOrganization from '../Core/Dialog/AddNewOrganization'
import PeopleIcon from '../Icons/2Peple';
import {getCountries, addOrganization} from '../../store/organizationList/actions';
import {countriesSelector, isShowSnackbar, snackbarType, snackbarText} from '../../store/organizationList/selectors';
import Snackbar from '@material-ui/core/Snackbar';

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

export default function OrganizationList() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [inputValues, setInputValues] = useState({
    country: 'PL', 
    lang: 'EN', 
    name: '', 
    admin_id: '', 
    contact_person_name: '', 
    contact_person_email: ''
  });

  const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(getCountries());
  },[])

  const countries = useSelector(countriesSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    
    setInputValues({
      country: 'PL', 
      lang: 'EN', 
      name: '', 
      admin_id: '', 
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
      admin_id: '', 
      contact_person_name: '', 
      contact_person_email: ''
    });
    setOpen(false);
  }

 
  //mock---------
  const orgObj = {
    organization: 100,
    active: 60,
    suspended: 40,
    terminated: 0,
  }
   //mock---------
  return (
    <MaynLayout>
      <TitleBlock  
        title={"Organization list"} 
        info={orgObj} 
        TitleButtonNew={"New Organisation"} 
        handleButtonNew={handleClickOpen}
      >
      <PeopleIcon />
      </TitleBlock>
      <AddNewOrganization
       open={open} 
       handleClose={handleClose} 
       title={"Add new organization"}  
       inputValues={inputValues}
       countries={countries}
       handleInputChange={handleInputChange}
       saveOrg={saveOrg}
       />
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