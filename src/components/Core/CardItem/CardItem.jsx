import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import StyledCheckbox from '../Checkbox/Checkbox';
import EditIcon from '../../Icons/EditIcon';
import RemoveRoleIcon from '../../Icons/RemoveRoleIcon';
import CreatePolicyIcon from '../../Icons/CreatePolicyIcon';
import DescriptionIcon from '../../Icons/DescriptionIcon';

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
  onClickAddPolicy,
  isDefault,
  canDelete = true,
  onChangeDefault,
  itemName,
  ariaLabel,
  descriptionCount,
  policiesCount,
  descriptionPolicies,
  additionalDescription,
  description,
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
  const nltobr = (str) => {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  return (
    <div
      className={classnames(classes.card, selected ? classes.active : '', additionalDescription ? classes.tall : '')}
      onClick={handleClick}
      onKeyDown={handleClick}
      role='option'
      aria-label={ariaLabel}
      aria-selected='true'
      tabIndex={0}
    >
      <p className={classes.card_title}>{name}</p>
      <small>{`${userCount} ${t(descriptionCount)}`}</small>
      { descriptionPolicies ? ( <><br /><small>{`${policiesCount} ${t(descriptionPolicies)}`}</small></>) : null }
      { additionalDescription ? ( <><br /><small>{`${t(additionalDescription)}`}</small></>) : null }
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
      {
        description ? (
          <div>
            <span
              className={classes.comment}
              data-tooltip-html={nltobr(description)}
              data-tooltip-id='timeoff_description'
            >
              <DescriptionIcon />
            </span>
          </div>
        ) : null
      }

      <div className={classes.card_actions}>
        <button
          className={classes.card_edit}
          aria-label={`edit ${itemName} button`}
          onClick={handleClickEdit}
        >
          <EditIcon aria-hidden />
        </button>
        { onClickAddPolicy && (
          <button
            className={classes.card_policy}
            aria-label={`create policy button`}
            onClick={onClickAddPolicy}
          >
            <CreatePolicyIcon />
          </button>
        )}
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
