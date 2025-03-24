import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import classes from './timeoff.module.scss';
import Progress from '../../Core/Progress';
import DataTable from '../../Core/DataTableCustom/OLT';
import CreatePolicyIcon from '../../Icons/CreatePolicyIcon';
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
  policies,
}) {
  const { t } = useTranslation();
  const [dataArray, setDataArray] = useState([]);
  const [columnsArray, setCollumnsArray] = useState(initColumnsArray);
  const [selectedRow, setSelectedRow] = useState(null);

  const detailsClasses = classNames(classes.details, {
    
  });

  useEffect(() => {
    if (activeTimeOff && activeTimeOff.id) {
      const policiesArray = policies.filter((policy) => policy.time_off_id === activeTimeOff.id);
      const data = policiesArray.map((policy) => {
        return {
          id: policy.id,
          name: policy.name,
          default: policy.default ? '' : '',
          description: policy.description,
          type: policy.type,
          days: policy.days,
          users_count: policy.users_count,
          //todo 
          not_active: true,
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
  }, [activeTimeOff, policies]);
  
  
  const renderFooterButton = () => {
    return !policies?.length ? (
      <div className={classes.footerButton}>
        <a className={classes.footerButton__button} onClick={createNewPolicy}>
          <CreatePolicyIcon />
          {t('Create new policy')}
        </a>
      </div>
    ) : null
  }

  return (
    <div className={detailsClasses}>
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
            simpleTable
            withoutFilterColumns
            hoverable
            hoverActions
            loading={loading}
            verticalOffset={'100px'}
            footerButton={renderFooterButton()}
            selectedItem={selectedRow}
            setSelectedItem={setSelectedRow}
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
