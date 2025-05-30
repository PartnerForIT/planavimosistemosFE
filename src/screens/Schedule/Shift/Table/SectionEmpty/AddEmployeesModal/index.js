import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';

import Input from '../../../../../../components/Core/Input/Input';
import Button from '../../../../../../components/Core/Button/Button';
import SearchIcon from '../../../../../../components/Icons/SearchIcon';
import Item from './Item';
import classes from './AddEmployeesModal.module.scss';

const trackYProps = {
  renderer: ({ elementRef, ...restProps }) => (
    <span
      {...restProps}
      ref={elementRef}
      className={classNames('trackY', classes.scrollbarTrackY)}
    />
  ),
};

export default ({
  onClose,
  onSubmit,
  items,
  relatives,
  total,
  jobTypeTitle,
  contentBoxRef,
}) => {
  const { t } = useTranslation();

  const [allItems, setAllItems] = useState(() => items.filter((item) => !(relatives || []).some((itemJ) => itemJ.employeeId === item.id)));
  const [searchValue, setSearchValue] = useState('');

  const filteredItems = useMemo(() => {
    if (searchValue) {
      return allItems.filter((item) => (item?.title && item.title.toLowerCase().includes(searchValue.toLowerCase())) || (item?.label && item.label.toLowerCase().includes(searchValue.toLowerCase())));
    }

    return allItems;
  }, [searchValue, allItems]);
  const totalSelected = useMemo(() => allItems.reduce((acc, item) => {
    if (item.checked) {
      return acc + 1;
    }

    return acc;
  }, 0), [allItems]);

  const handleChangeSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  };
  const handleChange = ({ id, ...values }) => {
    if (total <= totalSelected && values.checked) {
      return;
    }

    setAllItems((prevValues) => {
      const foundIndex = prevValues.findIndex((item) => item.id === id);
      return [
        ...prevValues.slice(0, foundIndex),
        {
          ...prevValues[foundIndex],
          ...values,
        },
        ...prevValues.slice(foundIndex + 1),
      ];
    });
  };
  const handleSubmit = () => {
    onSubmit(allItems.filter((item) => item.checked));
    onClose();
  };

  return (
    <ClickAwayListener onClickAway={onClose}>
      <div ref={contentBoxRef} className={classes.addEmployeesModal}>
        <div className={classes.addEmployeesModal__title}>
          {`${t('Add')} ${jobTypeTitle} ${totalSelected}/${total}`}
        </div>
        <Input
          icon={<SearchIcon />}
          placeholder={t('Search by Employee')}
          value={searchValue}
          name='search'
          fullWidth
          onChange={handleChangeSearch}
        />
        <Scrollbar
          noScrollX
          trackYProps={trackYProps}
          removeTracksWhenNotUsed
          className={classes.addEmployeesModal__scrollbar}
        >
          {filteredItems.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              label={item.label}
              checked={item.checked || false}
              onChange={handleChange}
            />
          ))}
        </Scrollbar>
        <Button fillWidth onClick={handleSubmit}>
          {`${t('Add')} ${jobTypeTitle}`}
        </Button>
      </div>
    </ClickAwayListener>
  );
};
