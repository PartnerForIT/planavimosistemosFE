import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import classes from './AddJobType.module.scss';
import PlusIcon from '../../../../../components/Icons/Plus';
import AddJobTypeModal from './AddJobTypeModal';

export default ({
  allJobTypes,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={classes.addJobType}
        onClick={handleClick}
      >
        {t('Add Job Type')}
        <div className={classes.addJobType__iconWrapper}>
          <PlusIcon />
        </div>
      </button>
      {
        isOpen && (
          <AddJobTypeModal
            onClose={handleClose}
            onSubmit={onSubmit}
            items={allJobTypes}
          />
        )
      }
    </>
  );
};
