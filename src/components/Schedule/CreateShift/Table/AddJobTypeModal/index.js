import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';

import Input from '../../../../Core/Input/Input';
import Button from '../../../../Core/Button/Button';
import SearchIcon from '../../../../Icons/SearchIcon';
import Item from './Item';
import classes from './AddJobTypeModal.module.scss';

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
}) => {
  const { t } = useTranslation();

  const [allItems, setAllItems] = useState(items);
  // const [filteredItems, setFilteredItems] = useState(items);
  const [searchValue, setSearchValue] = useState('');

  const handleChangeSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  };
  const handleChange = ({ id, ...values }) => {
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

  const filteredItems = useMemo(() => {
    if (searchValue) {
      return allItems.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()));
    }

    return allItems;
  }, [searchValue, allItems]);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <div className={classes.addJobType}>
        <div className={classes.addJobType__title}>
          {t('Add Job Type')}
        </div>
        <Input
          icon={<SearchIcon />}
          placeholder={t('Search by Job Type')}
          value={searchValue}
          name='search'
          fullWidth
          onChange={handleChangeSearch}
        />
        <Scrollbar
          noScrollX
          trackYProps={trackYProps}
          removeTracksWhenNotUsed
          className={classes.addJobType__scrollbar}
        >
          {filteredItems.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              label={item.title}
              value={item.value || 1}
              checked={item.checked || false}
              onChange={handleChange}
            />
          ))}
        </Scrollbar>
        <Button fillWidth onClick={handleSubmit}>
          {t('Add Job Type')}
        </Button>
      </div>
    </ClickAwayListener>
  );
};
