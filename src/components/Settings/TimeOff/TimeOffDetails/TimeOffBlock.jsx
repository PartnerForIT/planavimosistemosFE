import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import classes from '../timeoff.module.scss';
import RemoveTimeOff from '../../../Core/Dialog/RemoveTimeOff';
import RemovePolicy from '../../../Core/Dialog/RemovePolicy';
import TimeOffDetails from '../TimeOffDetails';
import CardItem from '../../../Core/CardItem/CardItem';
import CardItemAdd from '../../../Core/CardItemAdd/CardItemAdd';

function TimeOffBlock({
  time_offs = [],
  activeTimeOff = {},
  activePolicy = {},
  setActiveTimeOff = Function.prototype,
  createNewTimeOff = Function.prototype,
  createNewPolicy = Function.prototype,
  onEditPolicy = Function.prototype,
  onDeletePolicy = Function.prototype,
  onDuplicatePolicy = Function.prototype,
  remove = Function.prototype,
  loading = false,
  setEditVisible = Function.prototype,
  policies = [],
}) {
  const { t } = useTranslation();
  const [removeVisible, setRemoveVisible] = useState(false);
  const [removePolicyVisible, setRemovePolicyVisible] = useState(false);

  return (
    <div className={classes.timeoff}>
      <>
        {/* create new */}
        <CardItemAdd
          itemName='Policy Type'
          descriptionName={'Create a new time off policy type'}
          onClick={createNewTimeOff}
        />
        {/* roles board */}
        {
          time_offs.map((time_off) => (
            <React.Fragment key={time_off.id + time_off.name}>
              <CardItem
                id={time_off.id}
                item={time_off}
                onClick={setActiveTimeOff}
                onClickEdit={setEditVisible}
                onClickAddPolicy={createNewPolicy}
                onClickRemove={setRemoveVisible}
                name={time_off.name}
                userCount={123}
                policiesCount={time_off.count_policies}
                selected={time_off.id === activeTimeOff.id}
                canDelete={true}
                itemName='Policy Type'
                ariaLabel='user policy type'
                descriptionCount='users have this policy type'
                descriptionPolicies='active policies'
              />
              {/* Time off details */}
              {
                activeTimeOff?.id === time_off.id && (
                  <TimeOffDetails
                    createNewPolicy={createNewPolicy}
                    activeTimeOff={activeTimeOff}
                    loading={loading}
                    policies={policies}
                    onEditPolicy={onEditPolicy}
                    onDeletePolicy={setRemovePolicyVisible}
                    onDuplicatePolicy={onDuplicatePolicy}
                  />
                )
              }
              {
                activePolicy?.time_off_id === time_off.id && (
                  test
                )
              }
            </React.Fragment>
          ))
        }
        <RemoveTimeOff
          open={!!removeVisible}
          handleClose={() => setRemoveVisible(false)}
          title={t('Delete Policy Type')}
          name={removeVisible.name}
          buttonTitle={t('Delete')}
          remove={() => remove(removeVisible.id)}
        />
        <RemovePolicy
          open={!!removePolicyVisible}
          handleClose={() => setRemovePolicyVisible(false)}
          title={t('Delete Policy')}
          name={policies?.find((policy) => policy.id === removePolicyVisible)?.name}
          buttonTitle={t('Delete')}
          remove={() => onDeletePolicy(removePolicyVisible)}
        />
      </>
    </div>
  );
}

export default TimeOffBlock;
