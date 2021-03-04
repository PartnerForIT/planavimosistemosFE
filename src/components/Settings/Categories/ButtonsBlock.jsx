import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Tooltip from '../../Core/Tooltip';
import Label from '../../Core/InputLabel';
import Button from '../../Core/Button/Button';
import DialogCreateSkill from '../../Core/Dialog/CreateSkill';
import DialogCreateJob from '../../Core/Dialog/CreateJob';
import DialogCreatePlace from '../../Core/Dialog/CreatePlace';
import { createSkill, actionCreateJob, actionCreatePlace } from '../../../store/settings/actions';
import usePermissions from '../../Core/usePermissions';

const permissionsConfig = [
  {
    name: 'create_jobs',
    permission: 'categories_create',
    module: 'create_jobs',
  },
  {
    name: 'create_places',
    permission: 'categories_create',
    module: 'create_jobs',
  },
  {
    name: 'create_skills',
    permission: 'categories_create',
  },
];
export default function ButtonBlock({
  style, companyId, modules,
  selectedCategory,
  setSelectedCategory,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const permissions = usePermissions(permissionsConfig);

  const [openNewItem, setOpenNewItem] = useState(false);

  const buttons = useMemo(() => [
    {
      onClick: () => setSelectedCategory('skills'),
      inverse: selectedCategory !== 'skills',
      title: 'Skill name',
    },
    {
      onClick: () => setSelectedCategory('jobs'),
      inverse: selectedCategory !== 'jobs',
      title: 'Job name',
    },
    {
      onClick: () => setSelectedCategory('places'),
      inverse: selectedCategory !== 'places',
      title: 'Place name',
    },
  ], [selectedCategory, setSelectedCategory]);
  const { itemName, withAddButton } = useMemo(() => {
    switch (selectedCategory) {
      case 'skills': {
        return {
          itemName: 'skill',
          withAddButton: permissions.create_skills,
        };
      }
      case 'jobs': {
        return {
          itemName: 'job',
          withAddButton: permissions.create_jobs,
        };
      }
      case 'places': {
        return {
          itemName: 'place',
          withAddButton: permissions.create_places,
        };
      }
      default: return {};
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
      {
        withAddButton && (
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
        )
      }
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
