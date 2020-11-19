import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard'
import CompanyIcon from '../../../Icons/Company';
import { DropzoneDialog } from 'material-ui-dropzone';
import Form from './Form';
import styles from './company.module.scss';

export default function Company() {
  const params = useParams();
  const { t } = useTranslation();

  const [companyId, setCompanyId] = useState(null);
  const [open, SetOpen] = useState(false);
  const [file, setFile] = useState([]);

  useEffect(() => {
    setCompanyId(params.id)
  }, [params]);
  const handleOpen = () => {
    SetOpen(true)
  }
  const handleClose = () => {
    SetOpen(false)
  }
  const handleSave = (files) => {
    setFile(files);
    SetOpen(false)
  }


  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Company"}
        >
          <CompanyIcon />
        </TitleBlock>
        <PageLayout>

          <Form
            styles={styles}
            handleOpen={handleOpen}
          />

          <DropzoneDialog
            open={open}
            onSave={handleSave}
            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
            showPreviews={true}
            maxFileSize={500000}
            onClose={handleClose}
            filesLimit={1}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>

  )
}