import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import CompanyIcon from '../../../Icons/Company';

export default function Company() {
  const location = useLocation();

  const [companyId, setCompanyId] = useState(null)
  
  useEffect(() => {
    console.log('location.state', location.state); 
    setCompanyId(location.state.company_id)
 }, [location]);
  return (
    <MaynLayout>
      <TitleBlock  
        title={"Company"} 
      >
        <CompanyIcon />
      </TitleBlock>
      <PageLayout>
         Company id = {companyId}
      </PageLayout>
    </MaynLayout>

  )
}