import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard'
import JournalIcon from '../../../Icons/JournalIcon';

export default function Journal() {
  const params = useParams();
  const [companyId, setCompanyId] = useState(null)

  useEffect(() => {
    setCompanyId(params.id)
  }, [params]);

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Journal"}
        >
          <JournalIcon />
        </TitleBlock>
        <PageLayout>
          Journal id = {companyId}
        </PageLayout>
      </Dashboard>
    </MaynLayout>

  )
}