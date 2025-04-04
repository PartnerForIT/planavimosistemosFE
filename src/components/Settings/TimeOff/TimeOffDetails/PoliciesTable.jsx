import React, { useState, useEffect } from 'react';

import classes from '../timeoff.module.scss';
import Progress from '../../../Core/Progress';
import DataTable from '../../../Core/DataTableCustom/OLT';
import CreatePolicyIcon from '../../../Icons/CreatePolicyIcon';
import { useTranslation } from 'react-i18next';

const initColumnsArray = [
  { label: 'active policies', field: 'name', checked: true, comment_field: 'description' },
  { label: 'Default', field: 'default', checked: true },
  { label: 'Allowance type', field: 'type', checked: true },
  { label: 'Days', field: 'days', checked: true },
  { label: 'Users', field: 'users_count', checked: true },
];

const columnsWidthArray = {
  name: 'auto',
  default: '200px',
  type: 'auto',
  days: '100px',
  users_count: '100px',
};

function TimeOffDetails({
  activeTimeOff,
  loading,
  createNewPolicy,
  onEditPolicy,
  onDeletePolicy,
  onDuplicatePolicy,
  onClickPolicy,
  policies,
}) {
  const { t } = useTranslation();
  const [dataArray, setDataArray] = useState([]);
  const [columnsArray, setCollumnsArray] = useState(initColumnsArray);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (activeTimeOff && activeTimeOff.id) {
      const policiesArray = policies.filter((policy) => policy.time_off_id === activeTimeOff.id);
      const data = policiesArray.map((policy) => {
        return {
          ...policy,
          type: activeTimeOff?.name,
          unit: activeTimeOff?.unit,
          not_active: policy?.users?.length === 0,
        };
      }
      );
      setDataArray(data);
    }

    setCollumnsArray(() => {
      return initColumnsArray.map((column) => {
        return {
          ...column,
          label: column.field === 'name' ? (policies.length + ' ' + t(column.label)) : column.label,
        };
      });
    });
    // eslint-disable-next-line
  }, [activeTimeOff, policies]);

  const setSelectedPolicy = (policy) => {
    setSelectedRow(policy);
    onClickPolicy(policy);
  }
  
  const renderFooterButton = () => {
    return !policies?.length ? (
      <div className={classes.footerButton}>
        <button type="button" className={classes.footerButton__button} onClick={createNewPolicy}>
          <CreatePolicyIcon />
          {t('Create new policy')}
        </button>
      </div>
    ) : null
  }

  return (
    <div>
      {
        loading ? (
          <div className={classes.loader}>
            <Progress />
          </div>
        ) : (
          <DataTable
            data={dataArray || []}
            columns={columnsArray || []}
            columnsWidth={columnsWidthArray || {}}
            minHeight
            tallRows
            simpleTable
            withoutFilterColumns
            hoverable
            hoverActions
            loading={loading}
            verticalOffset={'100px'}
            footerButton={renderFooterButton()}
            selectedItem={selectedRow}
            setSelectedItem={setSelectedPolicy}
            editRow={onEditPolicy}
            removeRow={onDeletePolicy}
            duplicateRow={onDuplicatePolicy}
          />

        )
      }
    </div>
  );
}

export default TimeOffDetails;
