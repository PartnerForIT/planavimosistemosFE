import React, { useState, useRef, useEffect } from 'react';

import Button from './Button';
import Content from './Content';
import ItemMenu from './MenuItem';

const Dropdown = ({
  children,
  light,
  cancel,
  onCancel,
}) => {
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
    };
    // const handleScroll = () => {
    //   setIsOpen(false);
    // };

    document.addEventListener('mousedown', handleOuterDropdownClick, false);
    // window.addEventListener('wheel', handleScroll, false);

    return () => {
      document.removeEventListener('mousedown', handleOuterDropdownClick, false);
      // window.removeEventListener('wheel', handleScroll, false);
    };
  }, []);

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
      />
      {
        isOpen && (
          <Content
            onClose={handleCloseModal}
            wrapperRef={dropdownRef}
            offset={buttonRef.current.getBoundingClientRect()}
            cancel={cancel}
            onCancel={onCancel}
          >
            {children}
          </Content>
        )
      }
    </>
  );
};

Dropdown.ItemMenu = ItemMenu;

export default Dropdown;
