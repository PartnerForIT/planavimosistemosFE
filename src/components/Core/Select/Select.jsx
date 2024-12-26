import React, {
  useCallback, useEffect, useState, useRef
} from 'react';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Scrollbar from 'react-scrollbars-custom';
import Dropdown from '../Dropdown/Dropdown';
import StyledCheckbox from '../Checkbox/Checkbox';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import SearchIcon from '../../Icons/SearchIcon';
import Input from '../Input/Input';
import Button from '../Button/Button';
import styles from './Select.module.scss';
import { useTranslation } from 'react-i18next';

const initialItems = [];
export default function CustomSelect({
  items = initialItems,
  placeholder,
  onChange = Function.prototype,
  width = '100%',
  type = 'items',
  fullWidth,
  withSearch,
  confirmButton,
  disabled = false,
}) {
  const [itemsArray, setItemsArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [itemsStat, setItemsStat] = useState({ checked: 0, unchecked: 0, total: 0 });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { t } = useTranslation();
  const searchInputRef = useRef(null);


  useEffect(() => {
    const checkedItemsArray = [];
    const stat = { checked: 0, unchecked: 0, total: 0 };

    const setCheckedToAll = (array = []) => {
      const arrayCopy = array.length ? [...array] : [];

      return arrayCopy.map((item) => {
          if (!item.disabled) {
            if (item.checked) {
              checkedItemsArray.push(item);
              stat.checked += 1;
            } else {
              stat.unchecked += 1;
            }
            stat.total += 1;
          }
          if (item.items?.length) {
            setCheckedToAll(item.items);
          }

          return { ...item, checked: !!item.checked, type: item.type ? item.type : 'item' };
        });
    };

    const filterData = () => {
      if (!search) return items;
    
      const searchLower = search.toLowerCase();
    
      function filterItems(items) {
        return items.map(item => {
          if (item.type === "group") {
            // Create a new object for the group and filter its nested items
            const filteredSubItems = filterItems([...item.items]);
            if (filteredSubItems.length > 0) {
              return { ...item, items: filteredSubItems };
            }
            return null; // Return null if no subitems match, to filter out this group
          }
          if ((item.label || item.title || item.name).toLowerCase().includes(searchLower)) {
            return item; // Return the item if it matches
          }
          return null; // Return null if the item doesn't match
        }).filter(item => item !== null); // Filter out nulls to remove non-matching items and empty groups
      }
    
      return filterItems([...items]); // Copy the array to avoid modifying the original data
    };    

    setItemsArray(setCheckedToAll(filterData()));
    setCheckedItems(checkedItemsArray);
    setItemsStat({ ...stat });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, search]);

  useEffect(() => {
    setItemsStat({
      ...itemsStat,
      checked: checkedItems.length,
      unchecked: itemsStat.total - checkedItems.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems]);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const handleCheckboxChange = useCallback((item) => {
    const checkedItemsArray = [];
    const setCheckedToAll = (array, value) => {
      const arrayCopy = [...array];
      return arrayCopy.map((o) => {
        const newObj = { ...o };
        if (o.id === item.id) {
          if (!newObj.disabled) newObj.checked = value || !o.checked;
          if (newObj.items) {
            newObj.items = setCheckedToAll(o.items, !o.checked);
          }
        } else if (o.items) {
          if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;
          newObj.items = setCheckedToAll(o.items, value);
        } else if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;

        if (!newObj.disabled && newObj.checked) checkedItemsArray.push(newObj);

        return newObj;
      });
    };
    // Promise.all(setCheckedToAll(itemsArray)).then((resultedItems) => {
    //   setItemsArray(resultedItems);
    setItemsArray(setCheckedToAll(itemsArray));
    setCheckedItems(checkedItemsArray);
    onChange(checkedItemsArray);
  }, [itemsArray, onChange]);
  const selectAll = useCallback((check) => {
    const checkedItemsArray = [];
    const setCheckedToAll = (array) => {
      const arrayCopy = [...array];
      return arrayCopy.map((o) => {
        const newObj = { ...o };

        if (!newObj.disabled) newObj.checked = check;
        if (newObj.items) {
          newObj.items = setCheckedToAll(o.items);
        }

        if (!newObj.disabled && newObj.checked) checkedItemsArray.push(newObj);
        if (check) {
          setItemsStat({ ...itemsStat, checked: itemsStat.total, unchecked: 0 });
        } else {
          setItemsStat({ ...itemsStat, checked: 0, unchecked: itemsStat.total });
        }

        return newObj;
      });
    };

    // Promise.all(setCheckedToAll(itemsArray)).then((resultedItems) => {
    //   setItemsArray(resultedItems);
    setItemsArray(setCheckedToAll(itemsArray));
    setCheckedItems(checkedItemsArray);
    onChange(checkedItemsArray);
    // });
  }, [itemsArray, itemsStat, onChange]);

  const handleInputChange = (event) => {
    let {
      value,
    } = event.target;

    setSearch(value);
  };

  const wrapperClasses = classNames(styles.inputWrapper, {
    [styles.inputWrapperOpened]: open,
    [styles.inputWrapperfullWidth]: fullWidth,
  });
  const customSelectClasses = classNames(styles.customSelect, {
    [styles.customSelectOpened]: open,
  });

  const generateLabel = () => (checkedItems.length === 1 ? (checkedItems[0].label || checkedItems[0].title || checkedItems[0].name)
    : `${checkedItems.filter((e) => e.type !== 'group').length} ${t(`${type} selected`)}`);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div style={{ width }}>
        <div
          // eslint-disable-next-line jsx-a11y/aria-role
          role='input'
          className={wrapperClasses}
          onClick={disabled ? () => {} : () => setOpen(!open)}
        >
          <input
            type='text'
            value={checkedItems.length > 0 ? generateLabel() || '' : ''}
            placeholder={placeholder}
            className={customSelectClasses}
            onChange={() => {}}
            disabled={disabled}
          />
        </div>

        {open ? (
          <div className={classNames(styles.contentBox)}>
            {withSearch && (
              <Input
                ref={searchInputRef}
                icon={<SearchIcon />}
                placeholder={t('Search')}
                value={search}
                onChange={handleInputChange}
                fullWidth
              />
            )}
            <CheckboxGroup
              selectAll={selectAll}
              itemsStat={itemsStat}
            >
              <Scrollbar
                className={classNames(styles.scrollableContent, 'styledDropdown')}
                removeTracksWhenNotUsed
                noScrollX={true}
                trackXProps={{
                  renderer: ({ elementRef, ...restProps }) => (
                    <span
                      {...restProps}
                      ref={elementRef}
                      className={styles.scrollbarTrackX}
                    />
                  ),
                }}
                trackYProps={{
                  renderer: ({ elementRef, ...restProps }) => (
                    <span
                      {...restProps}
                      ref={elementRef}
                      className={styles.scrollbarTrackY}
                    />
                  ),
                }}
              >
                {
                  itemsArray.map((data) => (
                    data.type && data.type === 'group'
                      ? (
                        <Dropdown
                          key={data.id}
                          label={data.label || data.title || data.name}
                          currentItem={data}
                          checked={data.checked}
                          items={data.items}
                          onChange={handleCheckboxChange}
                        />
                      )
                      : (
                        <StyledCheckbox
                            key={data.id}
                            label={data.label || data.title || data.name}
                          item={data}
                          id={data.id}
                          checked={data.checked}
                          disabled={data.disabled}
                          onChange={handleCheckboxChange}
                        />
                      )
                  ))
                }
              </Scrollbar>
            </CheckboxGroup>
            {
              confirmButton && (
                <Button onClick={() => setOpen(false)} fillWidth size='big'>
                  {confirmButton}
                </Button>
              )
            }
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
}
