import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Scrollbar from 'react-scrollbars-custom';

import Dialog from '../../Core/Dialog';
import Textarea from '../../Core/Textarea/Textarea';
import usePermissions from '../../Core/usePermissions';
import { JournalDataSelector } from '../../../store/settings/selectors';
import classes from './EditComment.module.scss';


const permissionsConfig = [
  {
    name: 'app_manager',
    permission: 'app_manager',
  },
  {
    name: 'comments_photo',
    module: 'comments_photo',
  },
];
export default ({
  handleClose,
  open,
  selectedItem,
  onClickSave,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({});
  const permissions = usePermissions(permissionsConfig);
  const journal = useSelector(JournalDataSelector);

  useEffect(() => {
    
    if (open) {
      setFormValues({
        comment: (selectedItem.comments && selectedItem.comments[0] ? selectedItem.comments[0].comment : ''),
      });

    }
  }, [open, selectedItem]);

  const handleExited = () => {};
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextInputValues = { ...formValues, [name]: value };
    setFormValues(nextInputValues);
  };
  
  const handleClickSave = () => {
    onClickSave({
      ...selectedItem,
      ...formValues,
    });
  };

  return (
    <Dialog
      handleClose={handleClose}
      onExited={handleExited}
      open={!!open}
      title={t('Edit Comment')}
      maxWidth='xs'
      classes={{ paper: classes.modal }}
    >
      <Scrollbar
        className={classes.scrollbar}
        removeTracksWhenNotUsed
        noScrollX
        trackYProps={{
          renderer: ({ elementRef, ...restProps}) => (
            <span
              {...restProps}
              ref={elementRef}
              className={classes.scrollbarTrackY}
            />
          ),
        }}
      >
        <div className={classes.editEntry}>
          {
            (permissions.comments_photo && journal.end_day_comment) ? (
              <Textarea
                label={t('Comment')}
                placeholder={t('Add new comment here')}
                onChange={handleInputChange}
                name='comment'
                value={formValues.comment}
              />
            ) : null
          }
        </div>
      </Scrollbar>
      <button onClick={handleClickSave} className={classes.buttonSave}>
        {t('Save & Close')}
      </button>
    </Dialog>
  );
};
