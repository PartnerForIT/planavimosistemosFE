import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaynLayout from '../Core/MainLayout';
import TitleBlock from '../Core/TitleBlock';
import AddNewOrganization from '../Core/Dialog/AddNewOrganization'
import PeopleIcon from '../Icons/2Peple';

import {getCountries} from '../../store/organizationList/actions';

export default function OrganizationList() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getCountries());
  },[])

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
       />
    </MaynLayout>  
  )
}