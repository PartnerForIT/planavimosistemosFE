import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';

import Button from '../../../Core/Button/Button';
import DataTable from '../../../Core/DataTableCustom/OLT';
import AddGroup from '../../../Core/Dialog/AddGroup';

const columns = [
  { label: 'Title', field: 'name', checked: true },
  { label: 'Amount', field: 'users', checked: true },
  { label: 'Sub-groups', field: 'subgroups', checked: true },
  { label: 'ID', field: 'id', checked: true },
  // TODO: edit & remove
  // { label: '', field: 'actions', checked: true },
];

export default function GroupsBlock({
  style, groups = [],
  loading = false, setSelected, selected,
  addNewGroup,
}) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

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
        <div>
          <DataTable
            data={groups}
            columns={columns ?? []}
            columnsWidth={{}}
            onColumnsChange={() => {}}
            sortable
            loading={loading}
            onSelect={setSelected}
            selectedItem={selected}
            onSort={() => {}}
            // lastPage={page.last_page}
            // activePage={page.current_page}
            // itemsCountPerPage={page.per_page}
            // totalItemsCount={page.total}
            // handlePagination={console.log}
            // totalDuration={totalDuration}
            setSelectedItem={setSelected}
            verticalOffset='360px'
            simpleTable
          />
        </div>
      </div>
      <AddGroup
        open={visible}
        handleClose={() => setVisible(false)}
        title={t('Create a new group')}
        buttonTitle={t('Create Group')}
        groupName={groupName}
        setGroupName={setGroupName}
        addNewGroup={addNewGroup}
      />
    </>
  );
}
