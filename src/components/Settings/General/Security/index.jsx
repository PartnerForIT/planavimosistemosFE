import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import SecurityIcon from '../../../Icons/Security';

export default function Sesurity() {
  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Security"}
        >
          <SecurityIcon />
        </TitleBlock>
        <PageLayout>

          <div>Security</div>

        </PageLayout>
      </Dashboard>
    </MaynLayout>
  )
}