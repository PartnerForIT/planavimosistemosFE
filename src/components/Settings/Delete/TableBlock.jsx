import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import DataTable from '../../Core/DataTableCustom/OLT';
import Label from '../../Core/InputLabel';

const columns = [
  { label: 'Timestamp', field: 'created_at', checked: true },
  { label: 'User', field: 'user_id', checked: true },
  { label: 'IP', field: 'ip_address', checked: true },
  { label: 'Information', field: 'information', checked: true },
];

const columnsWidthArray = {
  created_at: 230,
  user_id: 230,
  ip_address: 230,
  information: 280,
};

const page = {};

export default function DeleteDataTable({
  style, deleteData = [], employees, t, isLoading,
}) {
  const [columnsArray, setColumnsArray] = useState(columns);
  const [dataArray, setDataArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalDuration] = useState(null);

  // filter function
  const userName = useCallback((row) => {
    const name = employees.filter((item) => item.user_id === row.user_id);
    if (row.user_id === 1) {
      return 'Admin';
    }
    return name[0] ? `${name[0].name} ${name[0].surname}` : '';
  }, [employees]);

  useEffect(() => {
    setDataArray(deleteData.length
      ? deleteData.map((item) => ({
        ...item,
        created_at: item.created_at ? moment(item.created_at).format('lll') : '',
        user_id: userName(item),
      }))
      : deleteData);
  }, [deleteData, userName]);

  const selectionHandler = (itemId, value) => {
    setDataArray((prevState) => prevState.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          checked: !item.checked,
        };
      }
      return item;
    }));

    if (value) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      const index = checkedItems.indexOf(itemId);
      checkedItems.splice(index, 1);
      setCheckedItems([...checkedItems]);
    }
  };

  const sortHandler = useCallback((field, asc) => {
    const sortNumFunction = (a, b) => (asc ? (a[field] - b[field]) : (b[field] - a[field]));
    const sortFunction = (a, b) => {
      if (typeof a[field] === 'number' && typeof b[field] === 'number') {
        return sortNumFunction(a, b);
      }
      if (typeof a[field] === 'object' || typeof b[field] === 'object') {
        return sortNumFunction(a, b);
      }
      if (asc) {
        return a[field].toString().localeCompare(b[field]);
      }
      return b[field].toString().localeCompare(a[field]);
    };
    const sortItems = (array) => {
      const arrayCopy = [...array];
      arrayCopy.sort(sortFunction);
      return arrayCopy;
    };
    setDataArray(sortItems);
  }, []);

  const rowSelectionHandler = (selectedRow) => {
    setSelectedItem(selectedRow);
  };

  return (
    <div className={style.table}>
      <Label text={t('Log')} htmlFor='' />
      <DataTable
        data={dataArray || []}
        columns={columnsArray || []}
        columnsWidth={columnsWidthArray || {}}
        onColumnsChange={setColumnsArray}
        sortable
        loading={isLoading}
        onSelect={selectionHandler}
        onSort={sortHandler}
        lastPage={page.last_page}
        activePage={page.current_page}
        itemsCountPerPage={page.per_page}
        totalItemsCount={page.total}
        handlePagination={console.log}
        selectedItem={selectedItem}
        totalDuration={totalDuration}
        setSelectedItem={rowSelectionHandler}
        verticalOffset='380px'
        simpleTable
      />
    </div>

  );
}
