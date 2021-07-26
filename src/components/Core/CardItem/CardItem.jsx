import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import StyledCheckbox from '../Checkbox/Checkbox';
import EditIcon from '../../Icons/EditIcon';
import RemoveRoleIcon from '../../Icons/RemoveRoleIcon';

import classes from './CardItem.module.scss';

const CardItem = ({
  selected,
  id,
  item,
  name,
  userCount,
  onClick,
  onClickEdit,
  onClickRemove,
  isDefault,
  canDelete = true,
  onChangeDefault,
  itemName,
  ariaLabel,
  descriptionCount,
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    onClick(item);
  };
  const handleClickEdit = () => {
    onClickEdit(true);
  };
  const handleClickRemove = () => {
    onClickRemove({ name, id });
  };

  return (
    <div
      className={classnames(classes.card, selected ? classes.active : '')}
      onClick={handleClick}
      onKeyDown={handleClick}
      role='option'
      aria-label={ariaLabel}
      aria-selected='true'
      tabIndex={0}
    >
      <p className={classes.card_title}>{name}</p>
      <small>{`${userCount} ${t(descriptionCount)}`}</small>
      {
        !!onChangeDefault && (!!isDefault || selected) && (
          <div className={classes.card_check}>
            <StyledCheckbox
              id={id}
              label={t('Make default')}
              checked={!!isDefault}
              onChange={onChangeDefault}
            />
          </div>
        )
      }

      <div className={classes.card_actions}>
        <button
          className={classes.card_edit}
          aria-label={`edit ${itemName} button`}
          onClick={handleClickEdit}
        >
          <EditIcon aria-hidden />
        </button>
        {
          canDelete && (
            <button
              className={classes.card_remove}
              aria-label={`remove ${itemName} button`}
              onClick={handleClickRemove}
            >
              <RemoveRoleIcon aria-hidden />
            </button>
          )
        }
      </div>
    </div>
  );
};
export default CardItem;
