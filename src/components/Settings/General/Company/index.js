import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import CompanyIcon from '../../../Icons/Company';

export default function Company() {
  const params = useParams();
  const [companyId, setCompanyId] = useState(null)
  
  useEffect(() => {
    console.log('location.state', params);
    setCompanyId(params.id)
 }, [params]);


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