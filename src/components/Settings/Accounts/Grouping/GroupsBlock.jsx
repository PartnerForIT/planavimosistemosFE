import React from 'react';
import { useTranslation } from 'react-i18next';

import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';

// TODO: remove
import style from './grouping.module.scss';
import Button from '../../../Core/Button/Button';
import DataTable from '../../../Core/DataTableCustom/OLT';

// TODO: uncomment
export default function GroupsBlock({ /* style */ }) {
  const { t } = useTranslation();
  return (
    <>
      <div className={style.categoryBlock}>
        <div className={style.labelBLock}>
          <Label text={t('Groups')} htmlFor='' />
          <Tooltip title='Select Group' />
          <div className={style.right}>
            <Button onClick={() => ({ })} inverse inline size='small'>
              {`+ ${t('add new group')}`}
            </Button>
          </div>
        </div>
        <div>
          <DataTable
            data={[]}
            columns={[]}
            columnsWidth={{}}
            onColumnsChange={() => {}}
            sortable
            loading={false}
            onSelect={() => {}}
            onSort={() => {}}
            // lastPage={page.last_page}
            // activePage={page.current_page}
            // itemsCountPerPage={page.per_page}
            // totalItemsCount={page.total}
            // handlePagination={console.log}
            // selectedItem={selectedItem}
            // totalDuration={totalDuration}
            // setSelectedItem={rowSelectionHandler}
            verticalOffset='360px'
            simpleTable
          />
        </div>
      </div>
    </>
  );
}
