import { useTranslation } from 'react-i18next';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import getOverflowParent from '../../../../../helpers/getOverflowParent';
import PlusIcon from '../../../../../components/Icons/Plus';
import AddEmployeesModal from './AddEmployeesModal';
import classesAddEmployeesModal from './AddEmployeesModal/AddEmployeesModal.module.scss';
import classes from './SectionEmpty.module.scss';

export default ({
  jobTypeTitle,
  employees,
  relatives,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const contentBoxRef = useRef(null);

  const total = useMemo(() => relatives.reduce((acc, item) => {
    if (!item.title) {
      return acc + 1;
    }

    return acc;
  }, 0), [relatives]);

  const handleClick = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      try {
        const parentBounding = getOverflowParent(buttonRef.current).getBoundingClientRect();
        const buttonBounding = buttonRef.current.getBoundingClientRect();
        const { height: heightContent } = contentBoxRef.current.getBoundingClientRect();
        const offsetTop = buttonBounding.top - parentBounding.top;
        const menuPlacement = (offsetTop - heightContent) > 0 ? 'top' : 'bottom';

        if (menuPlacement === 'top') {
          contentBoxRef.current.classList.add(classesAddEmployeesModal.addEmployeesModal_top);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  return (
    <>
      <button
        className={`sectionEmpty ${classes.sectionEmpty}`}
        onClick={handleClick}
        ref={buttonRef}
      >
        {t('Empty')}
        <div className={classes.sectionEmpty__iconWrapper}>
          <PlusIcon />
        </div>
      </button>
      {
        isOpen && (
          <AddEmployeesModal
            onClose={handleClose}
            onSubmit={onSubmit}
            items={employees}
            relatives={relatives}
            jobTypeTitle={jobTypeTitle}
            total={total}
            contentBoxRef={contentBoxRef}
          />
        )
      }
    </>
  );
};
