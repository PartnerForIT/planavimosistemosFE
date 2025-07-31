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
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import Popper from '@material-ui/core/Popper';

const isChecked = (items) => {
  return items.every(item => {
    if (Array.isArray(item.items)) {
      return isChecked(item.items)
    }
    return Boolean(item.checked)
  })
}

const filterData = (search, items) => {
  if (!search) return items;

  const searchLower = search.toLowerCase()

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
}

const initialItems = [];
export default function CustomSelect({
  items = initialItems,
  checkedItems,
  placeholder,
  onChange = Function.prototype,
  width = '100%',
  type = 'items',
  fullWidth,
  withSearch,
  confirmButton,
  disabled = false,
  choiceOfOnlyOne = false,
  widthLikeInput = false,
}) {
  const [itemsArray, setItemsArray] = useState([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { t } = useTranslation()
  const searchInputRef = useRef(null)
  const wrapperRef = useRef(null)

  const filteredItems = filterData(search, itemsArray)

  useEffect(() => {
    if (items?.length) {
      setItemsArray(items)
    }
  }, [items?.length])

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const handleCheckboxChange = useCallback((item, checked, applyToAll) => {
    const selectedEmployees = []
    const setChecked = (array, toAll) => {
      return array.map(child => {
        if (child.id === item.id || toAll) {
          child.checked = checked
          if (child.items) {
            child.items = setChecked(child.items, true)
          }
        }
        if (child.items) {
          child.items = setChecked(child.items, false)
        }
        if (child.checked) {
          selectedEmployees.push(child)
        }
        return child
      })
    }

    const res = setChecked([...itemsArray], applyToAll)
    
    setItemsArray(res)
    onChange(selectedEmployees);
  }, [itemsArray, onChange, choiceOfOnlyOne]);

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
           ref={wrapperRef}
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

        <Popper
          open={open}
          anchorEl={wrapperRef.current}
          placement="bottom-start"
          style={{ zIndex: 9999, width: widthLikeInput ? wrapperRef.current?.offsetWidth : 'auto' }}
        >
          <div className={classNames(styles.contentBox, { [styles.fullContentWidth]: widthLikeInput })}>
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
              selectAll={checked => handleCheckboxChange({}, checked, true)}
              itemsStat={{
                checked: isChecked(itemsArray) ? itemsArray.length : 0,
                unchecked: isChecked(itemsArray) ? 0 : itemsArray.length,
                total: itemsArray.length,
              }}
              choiceOfOnlyOne={choiceOfOnlyOne}
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
                  filteredItems.map((data) => (
                    data.type && data.type === 'group'
                      ? <Dropdown
                          key={data.id}
                          label={data.label || data.title || data.name}
                          currentItem={data}
                          checked={isChecked(data.items)}
                          items={data.items}
                          onChange={(item, checked) => handleCheckboxChange(item, checked)}
                          choiceOfOnlyOne={choiceOfOnlyOne}
                        />
                      : (
                        <StyledCheckbox
                          key={data.id}
                          label={data.label || data.title || data.name}
                          item={data}
                          id={data.id}
                          checked={isChecked([data])}
                          disabled={data.disabled}
                          onChange={(item, checked) => handleCheckboxChange(item, checked)}
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
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
