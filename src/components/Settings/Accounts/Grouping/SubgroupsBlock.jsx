import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import Button from '../../../Core/Button/Button';
import DataTable from '../../../Core/DataTableCustom/OLT';
import AddSubgroup from '../../../Core/Dialog/AddSubgroup';
import NoData from './NoData';
import RemoveGroup from '../../../Core/Dialog/RemoveGroup';

const columns = [
  { label: 'Title', field: 'name', checked: true },
  { label: 'Amount', field: 'users', checked: true },
  { label: 'ID', field: 'id', checked: true },
  { label: '', field: 'actions', checked: true },
];

export default function SubgroupsBlock({
  style, selected: selectedGroup, subgroups = [], addNewSubgroup, sort, loading,
  removeSubgroup, edit,
}) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [subgroupName, setSubgroupName] = useState('');
  const [removeVisible, setRemoveVisible] = useState(false);
  const [selectedSubgroup, setSelectedSubgroup] = useState({ });

  return (
    <>
      <div className={style.categoryBlock}>
        <div className={style.labelBLock}>
          <Label text={t('Sub-groups')} htmlFor='' />
          <Tooltip title='Select Sub-group' />
          <div className={style.right}>
            <Button onClick={() => setVisible(true)} inverse inline size='small' disabled={_.isEmpty(selectedGroup)}>
              {`+ ${t('add new sub-group')}`}
            </Button>
          </div>
        </div>
        <div className={style.table}>
          <DataTable
            data={subgroups ?? []}
            columns={columns ?? []}
            columnsWidth={{}}
            onColumnsChange={() => {}}
            sortable
            loading={loading}
            // onSelect={setSelectedSubgroup}
            onSort={(field, asc) => sort({ field, asc })}
            // lastPage={page.last_page}
            // activePage={page.current_page}
            // itemsCountPerPage={page.per_page}
            // totalItemsCount={page.total}
            // handlePagination={console.log}
            selectedItem={selectedSubgroup}
            // totalDuration={totalDuration}
            setSelectedItem={setSelectedSubgroup}
            verticalOffset='360px'
            simpleTable
            removeRow={() => setRemoveVisible(true)}
          />
          {
            _.isEmpty(selectedGroup)
              ? <NoData title={t('Select main group to attach subgroup')} />
              : !subgroups.length
              && <NoData title={t('No subgroups')} />
          }
        </div>
      </div>
      <AddSubgroup
        open={visible}
        handleClose={() => setVisible(false)}
        title={`${t('Create a new sub-group for')} ${selectedGroup?.name}`}
        buttonTitle={t('Create Sub-group')}
        addSubgroup={addNewSubgroup}
        selectedGroup={selectedGroup}
        name={subgroupName}
        setName={setSubgroupName}
      />
      <RemoveGroup
        title={t('Delete Sub-group?')}
        open={removeVisible}
        handleClose={() => setRemoveVisible(false)}
        buttonTitle='Delete'
        name={selectedSubgroup.name}
        remove={() => removeSubgroup(selectedSubgroup.id)}
      />
    </>
  );
}
