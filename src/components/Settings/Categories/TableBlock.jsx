import React, { useState, useCallback, useEffect } from 'react'
import DataTable from '../../Core/DataTableCustom/OLT';
import { useTranslation } from 'react-i18next';
import Label from '../../Core/InputLabel';

const columns = [
  { label: "Tille", field: 'name', checked: true },
  { label: "ID", field: 'id', checked: true },
  { label: "Cost $/h", field: 'cost', checked: true },
  { label: "Charge $/h", field: 'earn', checked: true },
  { label: "actions", field: 'actions', checked: true },
];

const columnsWidthArray = {
  name: 'auto',
  id: 'auto',
  cost: 'auto',
  earn: 'auto',
  actions: 90
};

const page = {};

export default function TableBlock({ style, skills }) {
  const { t } = useTranslation();
  const [columnsArray, setColumnsArray] = useState(columns);
  const [loading, setLoading] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalDuration, setTotalDuration] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    skills.map(item => {
      item.actions = "tableActions"
    })
    setDataArray(skills);
  }, [skills]);

  const selectionHandler = (itemId, value) => {
    skills.map(item => {
      if (item.id === itemId) {
        item.checked = !item.checked;
      }
    }
    );
    if (value) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      let index = checkedItems.indexOf(itemId);
      checkedItems.splice(index, 1)
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
      return arrayCopy
    };
    setDataArray(sortItems);
  }, []);

  const rowSelectionHandler = (selectedRow) => {
    setSelectedItem(selectedRow);
  };

  return (
    <div className={style.categoryPage__Table}>
      <Label text={t('Select Category')} htmlFor={""} />
      <DataTable
        data={dataArray || []}
        columns={columnsArray || []}
        columnsWidth={columnsWidthArray || {}}
        onColumnsChange={setColumnsArray}
        sortable
        loading={loading}
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
        verticalOffset='300px'
      />
    </div>
  )
}