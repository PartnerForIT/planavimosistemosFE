import React from 'react';
import MaynLayout from '../Core/MainLayout';
import TitleBlock from '../Core/TitleBlock';
import PeopleIcon from '../Icons/2Peple';

export default function OrganizationList() {
  
  const orgObj = {
    organization: 100,
    active: 60,
    suspended: 40,
    terminated: 0,
  }
  return (
    <MaynLayout>
      <TitleBlock  title={"Organization list"} info={orgObj} >
          <PeopleIcon />
      </TitleBlock>
    </MaynLayout>  
  )
}