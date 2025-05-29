import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Scrollbar from 'react-scrollbars-custom';
import StyledCheckbox from '../Checkbox/Checkbox';
import Input from '../Input/Input';
import './style.scss';

function getOverflowParent(node) {
  if (!node) {
    return null;
  }

  const isElement = node instanceof HTMLElement;
  const overflowY = isElement && (window.getComputedStyle(node).overflowY || window.getComputedStyle(node).overflow);
  const isOverflow = overflowY !== 'visible';

  if (isOverflow && node.scrollHeight >= node.clientHeight) {
    return node;
  }

  return getOverflowParent(node.parentNode) || document.body;
}

export default ({
  disabled,
  options = [], placeholder, onChange = () => ({}),
  name, value, valueKey = 'value', labelKey = 'label',
  id = 'select',
  labelId,
  className,
  small,
  wrong,
  withoutCheckbox = false,
  withoutSearch = false,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const contentBox = useRef(null);
  const scrollBar = useRef(null);

  const handleCheckboxChange = useCallback((item, nextValue) => {
    onChange({
      target: {
        name,
        value: nextValue ? item[valueKey] : undefined,
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
      'input-select_wrong': wrong,
      'input-select_small': small,
      [className]: className,
    },
  );

  const label = useMemo(() => {
    if (open && !withoutSearch) {
      return searchValue;
    }

    // eslint-disable-next-line eqeqeq
    if (!options || (options && options.message === 'Permission denied')) {
      return placeholder
    }

    // eslint-disable-next-line
    return options.find((option) => option[valueKey] == value)?.[labelKey] || '';//placeholder;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, open, options, value, searchValue, withoutSearch]);
  const optionsDisplayed = useMemo(() => {
    if (searchValue) {
      return options.filter((option) => (option[labelKey]?.toLowerCase()).includes?.(searchValue.toLowerCase()));
    }

    return options;
  }, [options, searchValue, labelKey]);

  useEffect(() => {
    if (!open || !buttonRef.current || !contentBox.current) return;

    try {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const overflowParent = getOverflowParent(buttonRef.current);
      const parentRect = overflowParent.getBoundingClientRect();

      const dropdownHeightPerOption = 36;
      const offsetTop = buttonRect.top - parentRect.top;
      const offsetBottom = parentRect.bottom - buttonRect.bottom;

      const menuPlacement = offsetBottom >= offsetTop ? 'bottom' : 'top';
      const maxVisibleOptions = Math.floor(
        (menuPlacement === 'bottom' ? offsetBottom : offsetTop - 36) / dropdownHeightPerOption
      );

      const visibleOptionsCount = Math.min(options.length, maxVisibleOptions);
      const dropdownHeight = visibleOptionsCount * dropdownHeightPerOption + 2;

      // Apply height and placement
      contentBox.current.style.minHeight = `${dropdownHeight}px`;
      contentBox.current.style.maxHeight = `${dropdownHeight}px`;

      contentBox.current.classList.toggle('input-select__content-box_top', menuPlacement === 'top');

      if (scrollBar.current) {
        const scrollToIndex = options.findIndex(obj => obj[valueKey] === value);
        scrollBar.current.scrollTo(0, scrollToIndex * dropdownHeightPerOption - (dropdownHeight / 2 - 18));
      }
    } catch (e) {
      console.error('Dropdown positioning error:', e);
    }
  }, [options, open, value, valueKey]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div id={id} className={containerClasses}>
        <div
          // eslint-disable-next-line jsx-a11y/aria-role
          role='input'
          id={id}
          className='input-select__control'
          onClick={() => setOpen((prevValue) => !prevValue)}
          ref={buttonRef}
        >
          <Input
            placeholder={placeholder}
            value={label}
            onChange={handleSearchChange}
            readOnly={!open || withoutSearch}
            id={id}
            labelid={labelId}
          />
        </div>

        {open ? (
          <div
            className='input-select__content-box'
            // style={{ minHeight: optionsDisplayed.length > 4 ? 150 : optionsDisplayed.length * 36 + 2 }}
            ref={contentBox}
          >
            <Scrollbar
              className='input-select__content-box__scrollbar'
              removeTracksWhenNotUsed
              noScrollX
              trackYProps={{
                renderer: ({ elementRef, ...restProps }) => (
                  <span
                    {...restProps}
                    ref={elementRef}
                    className={classNames('input-select__content-box__scrollbar__track-y', { trackY: true })}
                  />
                ),
              }}
              ref={scrollBar}
            >
              {
                optionsDisplayed.map((data) => (
                  !withoutCheckbox ? (
                    <StyledCheckbox
                      key={data[valueKey]}
                      label={data[labelKey]}
                      item={data}
                      id={data.id}
                      checked={data[valueKey] === value}
                      disabled={data.disabled}
                      onChange={handleCheckboxChange}
                    />
                  ) : (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      className='input-select__content-box__item'
                      onClick={() => {
                        onChange({
                          target: {
                            name,
                            value: data[valueKey],
                          },
                        });
                        setOpen(false);
                      }}
                    >
                      {data[labelKey]}
                    </div>
                  )
                ))
              }
            </Scrollbar>
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
};
