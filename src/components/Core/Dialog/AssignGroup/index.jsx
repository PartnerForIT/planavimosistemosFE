import React, { useEffect, useState } from 'react';
import Button from '../../Button/Button';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import CustomSelect from '../../../Core/Select/Select';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '../../../Icons/DeleteIcon';

import classes from './assignGroup.module.scss';

const initialFormValues = {};

export default function AssignGroup({
  handleClose, title, open,
  buttonTitle, assignGroup, initialValues, groups,
}) {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    setSelectedGroups([
      ...groups.map(g => ({ 
        ...g, 
        checked: initialValues?.groups?.findIndex(group => group.id === g.id) !== -1,
        subgroups: g.subgroups.map(sg => ({
          ...sg,
          checked: initialValues?.subgroups?.findIndex(group => group.id === sg.id) !== -1
        })),
        items: g.items.map(sg => ({
          ...sg,
          checked: initialValues?.subgroups?.findIndex(group => group.id === sg.id) !== -1
        }))
      }))
    ]);
  }, [groups, initialValues]);

  const handleAssignGroup = () => {
    assignGroup(formValues)
    onClose();
  };
  const onClose = () => {
    setFormValues(initialFormValues);
    handleClose();

  };

  const clearGroups = () => {
    setSelectedGroups(
      groups.map((group) => ({
        ...group,
        checked: false,
      })),
    );
    setFormValues(initialFormValues);
  };

  const onGroupsSelectChange = (selectedGroups) => {
    setFormValues({
      ...formValues,
      groups: selectedGroups,
    });
  };

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...initialValues,
        groups: [
          ...initialValues?.groups.map((group) => { return {...group, checked: true} }),
          ...initialValues?.subgroups.map((group) => { return {...group, checked: true} }),
        ],
      });
    } else {
      setFormValues({
        ...initialFormValues,
      });
    }
  }, [initialValues, open]);

  return (
    <Dialog onClose={onClose} open={open} PaperProps={{
      style: {
        overflow: 'visible',
      },
    }}>
      <div className={classes.assignGroup}>
        <div className={classes.assignGroup__title}>
          {title}
          <CloseIcon onClick={onClose} />
        </div>
        <div className={classes.assignGroup__form}>
          <div className={classes.assignGroup__groups}>
            <CustomSelect
              placeholder={t('All Groups')}
              buttonLabel={t('Filter')}
              items={selectedGroups ?? []}
              onChange={onGroupsSelectChange}
              width='230px'
              type='groups'
              confirmButton={t('Choose')}
            />
            <div>
              <button onClick={clearGroups} className={classes.assignGroup__removeButton}>
                <DeleteIcon
                  fill='#fd0d1b'
                  aria-hidden
                  className={classes.assignGroup__removeIcon}
                />
              </button>
            </div>
          </div>
          <Button onClick={handleAssignGroup} fillWidth size='big'>
            {buttonTitle}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
