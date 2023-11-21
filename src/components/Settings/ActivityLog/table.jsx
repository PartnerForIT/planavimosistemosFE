import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import DataTable from '../../Core/DataTableCustom/OLT';
import Label from '../../Core/InputLabel';
import useCompanyInfo from '../../../hooks/useCompanyInfo';

const columns = [
  {
    label: 'Timestamp',
    field: 'created_at',
    checked: true,
    date: true,
  },
  { label: 'User', field: 'user', checked: true },
  { label: 'Place', field: 'place_id', checked: true },
  { label: 'Action', field: 'action', checked: true },
  { label: 'Device', field: 'device', checked: true },
];

const columnsWidthArray = {
  created_at: 220,
  user: 160,
  place_id: 180,
  action: 180,
  device: 180,
};

const page = {};

export default function ActivityTable({
  style, activityLog = [], places, t, isLoading,
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

  const paceName = useCallback((row) => {
    const place = places.filter((item) => item.id === row.place_id);
    return place[0] ? place[0].name : '';
  }, [places]);

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
    setDataArray(activityLog.length
      ? activityLog.map((item) => ({
        ...item,
        created_at: item.created_at ? moment(item.created_at).format(`${dateFormat} HH:mm`) : '',
        user: `${item.user?.employee?.name} ${item.user?.employee?.surname}`,
        place_id: paceName(item),
      })).reverse()
      : activityLog.reverse());
  }, [activityLog, paceName]);

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

  const sortHandler = useCallback((field, asc, column) => {
    const sortNumFunction = (a, b) => (asc ? (a[field] - b[field]) : (b[field] - a[field]));
    const sortDate = (a, b) => (asc
      ? (new Date(a[field]) - new Date(b[field]))
      : (new Date(b[field]) - new Date(a[field])));

    const sortFunction = (a, b) => {
      if (column.date) {
        return sortDate(a, b);
      }
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
        verticalOffset='360px'
        simpleTable
      />
    </div>

  );
}
