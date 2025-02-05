import React, { useState, useRef } from 'react';

import Dropdown from '../Dropdown';

import classes from './ResourceItem.module.scss';
import AddEmployee from '../AddEmployee';
import Content from '../Dropdown/Content';


export default ({
  title,
  photo,
  skill,
  onAddEmployees,
  unavailableEmployees,
  handleDeleteEmployees,
  t,
}) => {
  const [isOpenEmployees, setIsOpenEmployees] = useState(false);
  const dropdownRef = useRef(null);
  const buttonPlusRef = useRef(null);

  return (
    <>
      <div className={classes.resourceItem__container} onClick={onAddEmployees ? () => setIsOpenEmployees(true) : null}>
      <div className={classes.resourceItem__name}>
        { title }
        { skill && <span className={classes.resourceItem__skill}>{skill}</span> }
      </div>
      {
        onAddEmployees && (
          <div ref={buttonPlusRef} className="fc-datagrid-cell-button_circle">+</div>
        )
      }
      {
        photo && (
          <img
            alt=''
            // className={styles.cellNameWithAvatar__image}
            src={photo}
          />
        )
      }
      {
        !onAddEmployees && (
          <Dropdown buttonClass={classes.resourceItem__buttonDots}>
            <div className={classes.resourceItem__title}>
              {title}
            </div>
            <Dropdown.ItemMenu
              title={t('Remove from list')}
              onClick={handleDeleteEmployees}
              remove
            />
          </Dropdown>
        )
      }
      </div>
      {
        isOpenEmployees && (
          <Content
            onCancel={() => setIsOpenEmployees(false)}
            wrapperRef={dropdownRef}
            offset={buttonPlusRef.current.getBoundingClientRect()}
            onTop
            cancel
            withBorder
            maxHeight={433}
          >
            <AddEmployee
              onAddEmployee={(data) => { setIsOpenEmployees(false); onAddEmployees(data); }}
              unavailableEmployees={unavailableEmployees}
            />
          </Content>
        )
      }
      {/*<div onClick={addEmployee}>Empty</div>*/}
    </>
  );
};
