import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import { onKeyDown } from '../../Helpers';
import AddRolesIcon from '../../Icons/AddRolesIcon';
import classes from './CardItemAdd.module.scss';

const CardItemAdd = ({
  onClick,
  itemName,
  descriptionName,
  tall = false,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classnames(classes.card, classes.default, tall ? classes.tall : '')}
      onClick={onClick}
      onKeyDown={(e) => onKeyDown(e, onClick)}
      role='option'
      aria-selected='true'
      aria-label={`create new ${itemName}`}
      tabIndex={0}
    >
      <p className={classes.card_title}>{t(`New ${itemName}`)}</p>
      <small>{t(descriptionName ? descriptionName : `Create a new ${itemName}`)}</small>
      <span className={classes.card_icon}>
        <AddRolesIcon aria-hidden />
      </span>
    </div>
  );
};
export default CardItemAdd;
