import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import Button from '../../../Core/Button/Button';
import DataTable from '../../../Core/DataTableCustom/OLT';
import AddEditItem from '../../../Core/Dialog/AddEditItem';
import NoData from './NoData';
import RemoveGroup from '../../../Core/Dialog/RemoveGroup';

const columns = [
  { label: 'Title', field: 'name', checked: true },
  { label: 'Amount', field: 'users', checked: true },
  { label: 'ID', field: 'id', checked: true },
];

export default function SubgroupsBlock({
  style, selected: selectedGroup, subgroups = [], sort, loading,
  removeSubgroup, onEditSubgroup, onAddSubgroup, withAddButton,
}) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [editItemId, setEditItemId] = useState('');
  const [columnsArray, setColumnsArray] = useState(columns);
  const [removeVisible, setRemoveVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedSubgroup, setSelectedSubgroup] = useState({ });

  const selectedItem = useMemo(() => {
    if (editItemId) {
      return subgroups.find((item) => item.id === editItemId);
    }

    return {};
  }, [editItemId, subgroups]);

  const handleEditSubgroup = (name) => {
    onEditSubgroup({
      name,
      id: editItemId,
    });
    setEditVisible(false);
  };
  const handleAddSubgroup = (name) => {
    onAddSubgroup(name);
    setVisible(false);
  };
  const handleRemoveSubgroup = () => {
    removeSubgroup(selectedItem.id);
    setRemoveVisible(false);
  };
  const handleEditRow = (id) => {
    setEditItemId(id);
    setEditVisible(true);
  };
  const handleRemoveRow = (id) => {
    setEditItemId(id);
    setRemoveVisible(true);
  };
  const handleClose = () => {
    setEditVisible(false);
    setRemoveVisible(false);
    setVisible(false);
    setEditItemId('');
  };

  return (
    <div className={style.categoryBlock}>
      <div className={style.labelBLock}>
        <Label text={t('Sub-groups')} htmlFor='' />
        <Tooltip title='Select Sub-group' />
        {
          withAddButton && (
            <div className={style.right}>
              <Button
                onClick={() => setVisible(true)}
                inverse
                inline
                size='small'
                disabled={_.isEmpty(selectedGroup)}
              >
                {`+ ${t('add new sub-group')}`}
              </Button>
            </div>
          )
        }
      </div>
      <div className={style.table}>
        <DataTable
          data={subgroups ?? []}
          columns={columnsArray ?? []}
          onColumnsChange={setColumnsArray}
          loading={loading}
          onSort={(field, asc) => sort({ field, asc })}
          selectedItem={selectedSubgroup}
          setSelectedItem={setSelectedSubgroup}
          verticalOffset='360px'
          removeRow={handleRemoveRow}
          editRow={handleEditRow}
          id='second'
          simpleTable
          withoutFilterColumns
          sortable
          hoverActions
          greyTitle
        />
        {
          _.isEmpty(selectedGroup)
            ? <NoData title={t('Select main group to attach subgroup')} />
            : !subgroups.length
            && <NoData title={t('No subgroups')} />
        }
      </div>
      {/* add */}
      <AddEditItem
        open={visible}
        title={`${t('Create a new sub-group for')} ${selectedGroup?.name}`}
        buttonTitle={t('Create Sub-group')}
        handleClose={handleClose}
        onSubmit={handleAddSubgroup}
      />
      {/* edit */}
      <AddEditItem
        initialValue={selectedItem.name}
        open={editVisible}
        title={t('Edit sub-group name')}
        buttonTitle={t('Save & Close')}
        handleClose={handleClose}
        onSubmit={handleEditSubgroup}
      />
      <RemoveGroup
        title={t('Delete Sub-group?')}
        open={removeVisible}
        handleClose={handleClose}
        buttonTitle='Delete'
        name={selectedItem.name}
        remove={handleRemoveSubgroup}
      />
    </div>
  );
}
