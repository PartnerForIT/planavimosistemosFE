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
  withoutCheckbox = false,
  withoutSearch = false,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const contentBox = useRef(null);

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
      'input-select_small': small,
      [className]: className,
    },
  );

  const label = useMemo(() => {
    if (open && !withoutSearch) {
      return searchValue;
    }

    // eslint-disable-next-line eqeqeq
    return options.find((option) => option[valueKey] == value)?.[labelKey] || placeholder;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, open, options, value, searchValue, withoutSearch]);
  const optionsDisplayed = useMemo(() => {
    if (searchValue) {
      return options.filter((option) => (option[labelKey]?.toLowerCase()).includes?.(searchValue.toLowerCase()));
    }

    return options;
  }, [options, searchValue, labelKey]);

  useEffect(() => {
    if (open) {
      try {
        const buttonBounding = buttonRef.current.getBoundingClientRect();
        const parentBounding = getOverflowParent(buttonRef.current).getBoundingClientRect();
        const offsetTop = buttonBounding.top - parentBounding.top;
        const offsetBottom = parentBounding.height - buttonBounding.top - buttonBounding.height - 30;

        const menuPlacement = offsetTop < offsetBottom ? 'bottom' : 'top';
        const menuPlacementHeight = (menuPlacement === 'bottom' ? offsetBottom : (offsetTop - 36)) - 20;

        const fullHeight = options.length * 36;
        const minHeight = menuPlacementHeight > fullHeight
          ? (fullHeight + 2)
          : (Math.trunc(menuPlacementHeight / 36) * 36);
        contentBox.current.style.minHeight = `${minHeight}px`;

        if (menuPlacement === 'top') {
          contentBox.current.classList.add('input-select__content-box_top');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [options, open]);

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
            labelId={labelId}
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
