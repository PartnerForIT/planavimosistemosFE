import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Tooltip from '../../Core/Tooltip';
import Label from '../../Core/InputLabel';
import Button from '../../Core/Button/Button';
import DialogCreateSkill from '../../Core/Dialog/CreateSkill';
import DialogCreateJob from '../../Core/Dialog/CreateJob';
import DialogCreatePlace from '../../Core/Dialog/CreatePlace';
import DialogCreateCustomCategory from '../../Core/Dialog/CreateCustomCategory';
import { createSkill, actionCreateJob, sendImportedPlacesSuccess, actionCreatePlace, actionCreateCustomCategory } from '../../../store/settings/actions';
import { importLoadingSelector, importedPlaces } from '../../../store/settings/selectors';
import { placesSelector } from '../../../store/places/selectors';
import { getPlaces } from '../../../store/places/actions';

import ImportPlaces from 'components/Core/Dialog/ImportPlaces';
import _ from 'lodash';

export default function ButtonBlock({
  style, companyId,
  selectedCategory,
  setSelectedCategory,
  permissions,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openNewItem, setOpenNewItem] = useState(false);
  const [openImportPlaces, setOpenImportPlaces] = useState(false);
  const importLoading = useSelector(importLoadingSelector);
  const allPlaces = useSelector(placesSelector);
  const imported = useSelector(importedPlaces);

  const clearImported = () => dispatch(sendImportedPlacesSuccess());

  const buttons = useMemo(() => {
    const data = [
      {
        onClick: () => setSelectedCategory('skills'),
        inverse: selectedCategory !== 'skills',
        title: 'Skill name',
      },
    ];

    if (permissions.create_jobs) {
      data.push({
        onClick: () => setSelectedCategory('jobs'),
        inverse: selectedCategory !== 'jobs',
        title: 'Job name',
      });
    }
    if (permissions.create_places) {
      data.push({
        onClick: () => setSelectedCategory('places'),
        inverse: selectedCategory !== 'places',
        title: 'Place name',
      });
    }
    if (permissions.custom_category) {
      data.push({
        onClick: () => setSelectedCategory('custom_category'),
        inverse: selectedCategory !== 'custom_category',
        title: 'Additional categories',
      });
    }

    return data;
  }, [permissions, selectedCategory, setSelectedCategory]);
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
      case 'custom_category': {
        return 'additional category';
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
  const createPlace = ({name, external_id}) => {
    dispatch(actionCreatePlace({ name, external_id }, companyId));
    handleCloseItem();
  };
  const createCustomCategory = ({name, entry_field}) => {
    dispatch(actionCreateCustomCategory({ name, entry_field }, companyId));
    handleCloseItem();
  };

  return (
    <div className={style.categoryPage__Button}>
      <div className={style.labelBlock}>
        <Label text={t('Select Category')} htmlFor='new_skill' />
        <Tooltip title={t('Select Category')} />
      </div>
      {
        buttons.map((button, index) => (
          <Button
            key={index+'-button'}
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
        {selectedCategory === 'places' && (
          <Button
            onClick={() => setOpenImportPlaces(true)}
            white
            fillWidth
            size='big'
          >
            {t(`Import places`)}
          </Button>
        )}
      </div>
      <DialogCreateSkill
        open={openNewItem && selectedCategory === 'skills'}
        handleClose={handleCloseItem}
        title={t('Create new skill')}
        buttonTitle={t('Create new skill')}
        createSkill={createNewSkill}
        permissions={permissions}
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
        permissions={permissions}
      />
      <DialogCreateCustomCategory
        open={openNewItem && selectedCategory === 'custom_category'}
        handleClose={handleCloseItem}
        title={t('Create additional category')}
        buttonTitle={t('Create Additional Category')}
        createCategory={createCustomCategory}
      />
      <ImportPlaces
        title={t('Import places')}
        open={openImportPlaces}
        handleClose={() => {
          if (importLoading) {
            return;
          }

          setOpenImportPlaces(false);
          if (!_.isEmpty(imported)) {
            dispatch(getPlaces(companyId));
          }
        }}
        imported={imported}
        clearImported={clearImported}
        places={allPlaces}
        loading={importLoading}
      />

    </div>
  );
}
