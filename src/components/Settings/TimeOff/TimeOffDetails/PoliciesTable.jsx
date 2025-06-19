import React, { useState, useEffect } from 'react';

import classes from '../timeoff.module.scss';
import Progress from '../../../Core/Progress';
import DataTable from '../../../Core/DataTableCustom/OLT';
import CreatePolicyIcon from '../../../Icons/CreatePolicyIcon';
import DescriptionIcon from '../../../Icons/DescriptionIcon';
import { useTranslation } from 'react-i18next';
import TimeOffSymbol1 from '../../../Icons/TimeOffSymbol1';
import TimeOffSymbol2 from '../../../Icons/TimeOffSymbol2';
import TimeOffSymbol3 from '../../../Icons/TimeOffSymbol3';
import TimeOffSymbol4 from '../../../Icons/TimeOffSymbol4';
import TimeOffSymbol5 from '../../../Icons/TimeOffSymbol5';
import TimeOffSymbol6 from '../../../Icons/TimeOffSymbol6';
import TimeOffSymbol7 from '../../../Icons/TimeOffSymbol7';
import TimeOffSymbol8 from '../../../Icons/TimeOffSymbol8';
import TimeOffSymbol9 from '../../../Icons/TimeOffSymbol9';

const nameFieldRenderer = (row) => (
  <div className={classes.tableName}>
    { (row.ready && row.symbol && row.color) ? (
      <span className={classes.tableSymbol} style={{ backgroundColor: row.color }}>
        {row.symbol === '1' && <TimeOffSymbol1 />}
        {row.symbol === '2' && <TimeOffSymbol2 />}
        {row.symbol === '3' && <TimeOffSymbol3 />}
        {row.symbol === '4' && <TimeOffSymbol4 />}
        {row.symbol === '5' && <TimeOffSymbol5 />}
        {row.symbol === '6' && <TimeOffSymbol6 />}
        {row.symbol === '7' && <TimeOffSymbol7 />}
        {row.symbol === '8' && <TimeOffSymbol8 />}
        {row.symbol === '9' && <TimeOffSymbol9 />}
      </span>
    ) : null }
    { row.name }
    { row.description && (
      <span
        className={classes.comment}
        data-tip={nltobr(row.description)}
        data-for='cell_description'
        data-html={true}
      >
        <DescriptionIcon />
      </span>
    )}
  </div>
);

const nltobr = (str) => {
  return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

const initColumnsArray = [
  { label: 'active policies', field: 'name', checked: true, cellRenderer: nameFieldRenderer },
  { label: 'Default', field: 'default', checked: true },
  { label: 'Allowance type', field: 'allowance_type_text', checked: true },
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

const allowance_type_arr = [
  { code: 'earned', name: 'Earned allowance' },
  { code: 'unlimited', name: 'Unlimited allowance' },
  { code: 'annual_grant', name: 'Annual grant' },
];

const units = [
  { code: 'hours', name: 'Hours' },
  { code: 'days', name: 'Days' },
];

function PoliciesTable({
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
          allowance_type_text: policy.ready ? t(allowance_type_arr.find((item) => item.code === policy.allowance_type)?.name) : '',
          description: policy?.description || '',
          not_active: !policy.ready,
          default: policy.ready ? (policy.set_default ? t('Yes') : t('No')) : '',
          users_count: policy.ready ? (policy.employees?.length || 0) : '',
          days: policy.ready ? (units.find((item) => item.code === activeTimeOff?.unit)?.name || '') : '',
        };
      }
      );
      setDataArray(data);
    }

    setCollumnsArray(() => {
      return initColumnsArray.map((column) => {
        return {
          ...column,
          label: column.field === 'name' ? ((policies?.filter(policy => policy.ready).length || 0) + ' ' + t(column.label)) : column.label,
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
            //editRow={onEditPolicy}
            removeRow={onDeletePolicy}
            duplicateRow={onDuplicatePolicy}
          />

        )
      }
    </div>
  );
}

export default PoliciesTable;
