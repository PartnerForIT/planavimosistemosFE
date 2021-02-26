import React, {
  useCallback,
  useState,
  useMemo,
} from 'react';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Scrollbar from 'react-scrollbars-custom';
import StyledCheckbox from '../Checkbox/Checkbox';
import Input from '../Input/Input';
import styles from './Select.module.scss';
import './style.scss';

export default ({
  options = [], placeholder, onChange = () => ({}),
  name, value, valueKey = 'value', labelKey = 'label', id, labelId,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = useCallback((item) => {
    onChange({
      target: {
        name,
        value: item[valueKey],
      },
    });
    setOpen(false);
  }, [name, valueKey, onChange]);
  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, [setSearchValue]);

  const containerClasses = classNames(
    'input-select',
    {
      'input-select_open': open,
    },
  );

  const label = useMemo(() => {
    if (open) {
      return searchValue;
    }

    return options.find((option) => option[valueKey] === value)?.[labelKey] || placeholder;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, open, searchValue]);
  const optionsDisplayed = useMemo(() => {
    if (searchValue) {
      return options.filter((option) => option[labelKey]?.includes?.(searchValue));
    }

    return options;
  }, [options, searchValue, labelKey]);

  return (
    <ClickAwayListener id={id} labelId={labelId} onClickAway={() => setOpen(false)}>
      <div id={id} className={containerClasses}>
        {/* eslint-disable-next-line jsx-a11y/aria-role */}
        <div role='input' id={id} className='input-select__control' onClick={() => setOpen(!open)}>
          <Input
            placeholder={placeholder}
            value={label}
            onChange={handleSearchChange}
            readOnly={!open}
            id={id}
            labelId={labelId}
          />
        </div>

        {open ? (
          <div className='input-select__content-box'>
            <Scrollbar
              className='input-select__content-box__scrollbar'
              removeTracksWhenNotUsed
              trackXProps={{
                renderer: (props) => {
                  const { elementRef, ...restProps } = props;
                  return (
                    <span
                      {...restProps}
                      ref={elementRef}
                      className={classNames(styles.scrollbarTrackX, { trackX: true })}
                    />
                  );
                },
              }}
              trackYProps={{
                renderer: (props) => {
                  const { elementRef, ...restProps } = props;
                  return (
                    <span
                      {...restProps}
                      ref={elementRef}
                      className={classNames(styles.scrollbarTrackY, { trackY: true })}
                    />
                  );
                },
              }}
            >
              {
                optionsDisplayed.map((data) => (
                  <StyledCheckbox
                    key={data[valueKey]}
                    label={data[labelKey]}
                    item={data}
                    id={data.id}
                    checked={data[valueKey] === value}
                    disabled={data.disabled}
                    onChange={handleCheckboxChange}
                  />
                ))
              }
            </Scrollbar>
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
};
