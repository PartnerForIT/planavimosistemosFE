import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';

import Button from '../../../Core/Button/Button';
import DataTable from '../../../Core/DataTableCustom/OLT';
import AddEditGroup from '../../../Core/Dialog/AddEditGroup';
import RemoveGroup from '../../../Core/Dialog/RemoveGroup';

const columns = [
  { label: 'Title', field: 'name', checked: true },
  { label: 'Amount', field: 'users', checked: true },
  { label: 'Sub-groups', field: 'subgroups', checked: true },
  { label: 'ID', field: 'id', checked: true },
  { label: '', field: 'actions', checked: true },
];

const columnsWidthArray = {
  name: 120,
  id: 40,
  actions: 80,
};

export default function GroupsBlock({
  style, groups = [],
  loading = false, setSelected, selected,
  addNewGroup, sort, removeGroup, edit,
}) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [removeVisible, setRemoveVisible] = useState(false);
  const [columnsArray, setColumnsArray] = useState(columns);

  // const handleEditRow = (rowId) => {
  //   setEditVisible(rowId);
  // };
  // const handleRemoveRow = (rowId) => {
  //   setRemoveVisible(rowId);
  // };
  const handleEditRow = () => {
    setEditVisible(true);
  };
  const handleRemoveRow = () => {
    setRemoveVisible(true);
  };

  // const selectedRow = useMemo(() => {
  //   if (groups.length) {
  //     const groupId = removeVisible || editVisible;
  //     return groups.find((group) => (group.id === groupId));
  //   }
  //
  //   return null;
  // }, [groups, removeVisible, editVisible]);

  return (
    <>
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
            // data={[...groups, ...groups, ...groups, ...groups, ...groups, ...groups, ...groups, ...groups, ...groups]}
            columns={columnsArray ?? []}
            onColumnsChange={setColumnsArray}
            sortable
            loading={loading}
            onSelect={setSelected}
            selectedItem={selected}
            onSort={(field, asc) => sort({ field, asc })}
            columnsWidth={columnsWidthArray}
            withoutFilterColumns
            // columnsWidth={columnsWidthArray}
            // lastPage={page.last_page}
            // activePage={page.current_page}
            // itemsCountPerPage={page.per_page}
            // totalItemsCount={page.total}
            // handlePagination={console.log}
            // totalDuration={totalDuration}
            setSelectedItem={setSelected}
            verticalOffset='360px'
            simpleTable
            editRow={handleEditRow}
            removeRow={handleRemoveRow}
            statusIcon={false}
          />
        </div>
      </div>
      {/* add group */}
      <AddEditGroup
        open={visible}
        handleClose={() => {
          setGroupName('');
          setVisible(false);
        }}
        title={t('Create a new group')}
        buttonTitle={t('Create Group')}
        groupName={groupName}
        setGroupName={setGroupName}
        handleOk={addNewGroup}
      />
      {/* edit group name */}
      <AddEditGroup
        open={editVisible}
        handleClose={() => {
          setGroupName('');
          setEditVisible(false);
        }}
        title={t('Edit group name')}
        buttonTitle={t('Save & Close')}
        // groupName={groupName || selectedRow?.name}
        setGroupName={setGroupName}
        handleOk={edit}
        // oldGroupName={selectedRow?.name}
        groupName={groupName || selected?.name}
        oldGroupName={selected?.name}
      />
      <RemoveGroup
        title={t('Delete Group?')}
        open={removeVisible}
        handleClose={() => setRemoveVisible(false)}
        buttonTitle='Delete'
        // name={selectedRow?.name}
        // remove={() => removeGroup(selectedRow?.id)}
        name={selected.name}
        remove={() => removeGroup(selected.id)}
      />
    </>
  );
}
