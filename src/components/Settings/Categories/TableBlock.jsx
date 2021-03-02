import React, {
  useState, useCallback, useEffect, useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from '../../Core/DataTableCustom/OLT';
import Label from '../../Core/InputLabel';
import { AdminContext } from '../../Core/MainLayout';
import CurrencySign from '../../shared/CurrencySign';

const LabelWithCurrencySign = ({ title, tail }) => (
  <>
    {title}
    {' '}
    <CurrencySign />
    {tail}
  </>
);

const columns = [
  { label: 'Tille', field: 'name', checked: true },
  { label: 'ID', field: 'id', checked: true },
  { label: <LabelWithCurrencySign title='Cost' tail='/h' />, field: 'cost', checked: true },
  { label: <LabelWithCurrencySign title='Charge' tail='/h' />, field: 'earn', checked: true },
  { label: 'actions', field: 'actions', checked: true },
];

const columnsWidthArray = {
  name: 'auto',
  id: 'auto',
  cost: 'auto',
  earn: 'auto',
  actions: 90,
};

const page = {};

export default function TableBlock({ style, skills, modules }) {
  const { t } = useTranslation();
  const isSuperAdmin = useContext(AdminContext);
  const [columnsArray, setColumnsArray] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    setDataArray(skills.map((item) => ({
      ...item,
      actions: 'tableActions',
    })));
  }, [skills]);

  useEffect(() => {
    let allColumnsArray = columns;

    if (!isSuperAdmin) {
      allColumnsArray = allColumnsArray.filter((column) => {
        if (!modules.cost_earning && column.field === 'cost') {
          return false;
        }
        if (!modules.profitability && column.field === 'earn') {
          return false;
        }
        return true;
      });
    }

    setColumnsArray(allColumnsArray);
  }, [isSuperAdmin, modules]);

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
    <div className={style.categoryPage__Table}>
      <Label text={t('Select Category')} htmlFor='' />
      <DataTable
        data={dataArray || []}
        columns={columnsArray || []}
        columnsWidth={columnsWidthArray || {}}
        onColumnsChange={setColumnsArray}
        sortable
        onSelect={selectionHandler}
        onSort={sortHandler}
        lastPage={page.last_page}
        activePage={page.current_page}
        itemsCountPerPage={page.per_page}
        totalItemsCount={page.total}
        handlePagination={console.log}
        selectedItem={selectedItem}
        setSelectedItem={rowSelectionHandler}
        verticalOffset='360px'
        simpleTable
      />
    </div>
  );
}
