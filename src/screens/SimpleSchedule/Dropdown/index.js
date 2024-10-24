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
  cancel,
  onCancel,
  buttonClass,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);

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
      }
    },
    close: () => {
      if (isOpen) {
        setIsOpen(false);
      }
    },
  }));

  const handleClick = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
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
