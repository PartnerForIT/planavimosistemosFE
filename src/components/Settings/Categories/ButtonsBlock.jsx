import React, { useContext, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Tooltip from '../../Core/Tooltip';
import Label from '../../Core/InputLabel';
import Button from '../../Core/Button/Button';
import DialogCreateSkill from '../../Core/Dialog/CreateSkill';
import DialogCreateJob from '../../Core/Dialog/CreateJob';
import DialogCreatePlace from '../../Core/Dialog/CreatePlace';
import { createSkill, actionCreateJob, actionCreatePlace } from '../../../store/settings/actions';
import { AdminContext } from '../../Core/MainLayout';

export default function ButtonBlock({
  style, companyId, modules,
  selectedCategory,
  setSelectedCategory,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isSuperAdmin = useContext(AdminContext);

  const [openNewItem, setOpenNewItem] = useState(false);

  const buttons = useMemo(() => {
    const data = [
      {
        onClick: () => setSelectedCategory('skills'),
        inverse: selectedCategory !== 'skills',
        title: 'Skill name',
      },
    ];

    if (isSuperAdmin || !!modules.create_jobs) {
      data.push({
        onClick: () => setSelectedCategory('jobs'),
        inverse: selectedCategory !== 'jobs',
        title: 'Job name',
      });
    }
    if (isSuperAdmin || !!modules.create_places) {
      data.push({
        onClick: () => setSelectedCategory('places'),
        inverse: selectedCategory !== 'places',
        title: 'Place name',
      });
    }

    return data;
  }, [isSuperAdmin, modules, selectedCategory, setSelectedCategory]);
  const itemName = useMemo(() => {
    switch (selectedCategory) {
      case 'skills': {
        return 'skill';
      }
      case 'jobs': {
        return 'job';
      }
      case 'places': {
        return 'place';
      }
      default: return '';
    }
  }, [selectedCategory]);

  const handleCloseItem = () => {
    setOpenNewItem(false);
  };

  const createNewSkill = (values) => {
    dispatch(createSkill({
      ...values,
      use_rates: Number(values.use_rates),
    }, companyId));
    handleCloseItem();
  };
  const createJob = (name) => {
    dispatch(actionCreateJob({ title: name }, companyId));
    handleCloseItem();
  };
  const createPlace = (name) => {
    dispatch(actionCreatePlace({ name }, companyId));
    handleCloseItem();
  };

  return (
    <div className={style.categoryPage__Button}>
      <div className={style.labelBlock}>
        <Label text={t('Select Category')} htmlFor='new_skill' />
        <Tooltip title='Select Category' />
      </div>
      {
        buttons.map((button) => (
          <Button
            onClick={button.onClick}
            inverse={button.inverse}
            fillWidth
            size='big'
          >
            {t(button.title)}
          </Button>
        ))
      }
      <div className={style.newSkillBlock}>
        <Label text={t(`New ${itemName}`)} htmlFor={`new_${itemName}`} />
        <Button
          onClick={setOpenNewItem}
          white
          fillWidth
          size='big'
        >
          {t(`Create new ${itemName}`)}
        </Button>
      </div>
      <DialogCreateSkill
        open={openNewItem && selectedCategory === 'skills'}
        handleClose={handleCloseItem}
        title={t('Create new skill')}
        buttonTitle={t('Create new skill')}
        createSkill={createNewSkill}
        modules={modules}
      />
      <DialogCreateJob
        open={openNewItem && selectedCategory === 'jobs'}
        handleClose={handleCloseItem}
        title={t('Create Job name')}
        buttonTitle={t('Create Job Name')}
        createJob={createJob}
      />
      <DialogCreatePlace
        open={openNewItem && selectedCategory === 'places'}
        handleClose={handleCloseItem}
        title={t('Create Place name')}
        buttonTitle={t('Create Place Name')}
        createPlace={createPlace}
      />
    </div>
  );
}
