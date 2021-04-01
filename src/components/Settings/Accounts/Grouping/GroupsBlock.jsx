import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';

import Button from '../../../Core/Button/Button';
import DataTable from '../../../Core/DataTableCustom/OLT';
import RemoveGroup from '../../../Core/Dialog/RemoveGroup';
import AddEditItem from '../../../Core/Dialog/AddEditItem';

const columns = [
  {
    label: 'Title',
    field: 'name',
    checked: true,
    minWidth: 100,
  },
  {
    label: 'Amount',
    field: 'users',
    checked: true,
    minWidth: 80,
  },
  {
    label: 'Sub-groups',
    field: 'subgroups',
    checked: true,
    minWidth: 100,
  },
  {
    label: 'ID',
    field: 'id',
    checked: true,
    minWidth: 80,
  },
];

const columnsWidthArray = {
  // name: 120,
  // // id: 40,
  // actions: 80,
  // subgroups: 120,
};

export default function GroupsBlock({
  style, groups = [],
  loading = false, setSelected, selected,
  onAddGroup, sort, removeGroup, onEditGroup,
}) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editItemId, setEditItemId] = useState('');
  const [removeVisible, setRemoveVisible] = useState(false);
  const [columnsArray, setColumnsArray] = useState(columns);

  const selectedItem = useMemo(() => {
    if (editItemId) {
      return groups.find((item) => item.id === editItemId);
    }

    return {};
  }, [editItemId, groups]);

  const handleEditGroup = (name) => {
    onEditGroup({
      name,
      id: editItemId,
    });
    setEditVisible(false);
  };
  const handleAddGroup = (name) => {
    onAddGroup(name);
    setVisible(false);
  };
  const handleRemoveGroup = () => {
    removeGroup(selectedItem.id);
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
        <Label text={t('Groups')} htmlFor='' />
        <Tooltip title='Select Group' />
        <div className={style.right}>
          <Button onClick={() => setVisible(true)} inverse inline size='small'>
            {`+ ${t('add new group')}`}
          </Button>
        </div>
      </div>
      <div className={style.table}>
        <DataTable
          data={groups}
          columns={columnsArray ?? []}
          onColumnsChange={setColumnsArray}
          loading={loading}
          onSelect={setSelected}
          selectedItem={selected}
          onSort={(field, asc) => sort({ field, asc })}
          columnsWidth={columnsWidthArray}
          setSelectedItem={setSelected}
          verticalOffset='360px'
          editRow={handleEditRow}
          removeRow={handleRemoveRow}
          statusIcon={false}
          withoutFilterColumns
          simpleTable
          sortable
          hoverActions
          greyTitle
        />
      </div>
      {/* add */}
      <AddEditItem
        open={visible}
        title={t('Create a new group')}
        buttonTitle={t('Create Group')}
        handleClose={handleClose}
        onSubmit={handleAddGroup}
      />
      {/* edit */}
      <AddEditItem
        initialValue={selectedItem.name}
        open={editVisible}
        title={t('Edit group name')}
        buttonTitle={t('Save & Close')}
        handleClose={handleClose}
        onSubmit={handleEditGroup}
      />
      <RemoveGroup
        title={t('Delete Group?')}
        open={removeVisible}
        handleClose={handleClose}
        buttonTitle='Delete'
        name={selectedItem.name}
        remove={handleRemoveGroup}
      />
    </div>
  );
}
