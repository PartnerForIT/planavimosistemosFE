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
import './style.scss';

export default ({
  disabled,
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
      'input-select_disabled': disabled,
    },
  );

  // console.log('value', value);
  // console.log('options', options);
  const label = useMemo(() => {
    if (open) {
      return searchValue;
    }

    // eslint-disable-next-line eqeqeq
    return options.find((option) => option[valueKey] == value)?.[labelKey] || placeholder;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, open, options, value, searchValue]);
  // console.log('label', label);
  const optionsDisplayed = useMemo(() => {
    if (searchValue) {
      return options.filter((option) => (option[labelKey]?.toLowerCase()).includes?.(searchValue.toLowerCase()));
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
              noScrollX
              trackYProps={{
                renderer: (props) => {
                  const { elementRef, ...restProps } = props;
                  return (
                    <span
                      {...restProps}
                      ref={elementRef}
                      className={classNames('input-select__content-box__scrollbar__track-y', { trackY: true })}
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
