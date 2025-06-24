import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';

import Button from './Button';
import Content from './Content';
import ItemMenu from './MenuItem';

const Dropdown = forwardRef(({
  children,
  light,
  initalValue = false,
  cancel,
  onCancel,
  buttonClass,
  onToggle,
}, ref) => {
  const [isOpen, setIsOpen] = useState(initalValue);

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOuterDropdownClick = (e) => {
      if (dropdownRef && dropdownRef.current
          && ((dropdownRef.current.contains(e.target)
              || (buttonRef.current && buttonRef.current.contains(e.target))))
      ) {
        return;
      }
      setIsOpen(false);
      if (onToggle) onToggle(false);
      if (onCancel) {
        onCancel();
      }
    };
    document.addEventListener('mousedown', handleOuterDropdownClick, false);

    return () => {
      document.removeEventListener('mousedown', handleOuterDropdownClick, false);
    };

    // eslint-disable-next-line
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => {
      if (!isOpen) {
        setIsOpen(true);
        if (onToggle) onToggle(true);
      }
    },
    close: () => {
      if (isOpen) {
        setIsOpen(false);
        if (onToggle) onToggle(false);
      }
    },
  }));

  const handleClick = () => {
    setIsOpen((prevState) => !prevState);
    if (onToggle) onToggle(!isOpen);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
    if (onToggle) onToggle(!isOpen);
  };
  
  return (
    <>
      <Button
        onClick={handleClick}
        ref={buttonRef}
        active={isOpen}
        light={light}
        className={buttonClass}
      />
      {
        isOpen && (
          <Content
            onClose={handleCloseModal}
            wrapperRef={dropdownRef}
            offset={buttonRef.current.getBoundingClientRect()}
            cancel={cancel}
            onCancel={onCancel}
            maxHeight={421}
            withBorder
          >
            {children}
          </Content>
        )
      }
    </>
  );
});

Dropdown.ItemMenu = ItemMenu;

export default Dropdown;
