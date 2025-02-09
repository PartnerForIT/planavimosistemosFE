import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';

import useCompanyInfo from '../../../../hooks/useCompanyInfo';
import DataTable from '../../../Core/DataTableCustom/OLT';
import Label from '../../../Core/InputLabel';

const columns = [
  { label: 'Timestamp', field: 'created_at', checked: true },
  { label: 'User', field: 'email', checked: true },
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
  const { getDateFormat } = useCompanyInfo();
  const dateFormat = getDateFormat({
    'YY.MM.DD': 'YYYY, MMM DD',
    'DD.MM.YY': 'DD MMM, YYYY',
    'MM.DD.YY': 'MMM DD, YYYY',
  });

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

  moment.updateLocale('lt', {
    weekdays: ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"],
    months: [
      "Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"
    ],
    monthsShort: [
      "Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rugp", "Rugs", "Spa", "Lap", "Gru"
    ],
    // Add any additional locale settings as needed
  });

  moment.locale(localStorage.getItem('i18nextLng') || 'en');

  useEffect(() => {
    setDataArray(deleteData.length
      ? deleteData.map((item) => ({
        ...item,
        created_at: item.created_at ? moment(item.created_at).format(`${dateFormat} HH:mm`) : '',
        user_id: userName(item),
      }))
      : deleteData);
  }, [deleteData, userName, dateFormat]);

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
        verticalOffset='430px'
        simpleTable
      />
    </div>

  );
}
