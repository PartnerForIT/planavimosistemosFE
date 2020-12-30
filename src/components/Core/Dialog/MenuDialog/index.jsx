import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from '@material-ui/core';
import classnames from 'classnames';
import classes from './MenuDialog.module.scss';
import LockIcon from '../../../Icons/LockIcon';
import LogOutIcon from '../../../Icons/LogOutIcon';
import LanguageDropdown from './LanguageDropdown';

const paperStyle = {
  transform: 'translateY(45px)',
  zIndex: 999,
  minWidth: 250,
  minHeight: 100,
  fontSize: 14,
};

function MenuDialog({
  open, anchorEl = null, setAnchorEl, setMenuOpen, logOut = () => ({}),
  editPassword = () => ({}),
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng'));

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
    setExpanded(false);
  };

  useEffect(() => {
    localStorage.setItem('i18nextLng', language);
  }, [language]);

  return (
    <Menu
      onClose={handleClose}
      open={open}
      className={classes.menu}
      anchorEl={anchorEl}
      style={{ transformOrigin: 'center bottom', position: 'absolute' }}
      PaperProps={{
        style: paperStyle,
      }}
      MenuListProps={{
        style: {
          minWidth: 200, width: '100%', paddingBottom: 0, paddingTop: 0,
        },
      }}
    >

      <div className={classes.top}>
        <MenuItem className={classes.menu_item}>
          <button
            className={classes.changePass}
            onClick={() => {
              editPassword();
              handleClose();
            }}
          >
            <LockIcon aria-hidden />
            {t('Change password')}
          </button>
        </MenuItem>
        <MenuItem className={classnames(classes.menu_item, expanded ? classes.language : '')}>
          <LanguageDropdown
            expanded={expanded}
            setExpanded={setExpanded}
            language={language}
            setLanguage={setLanguage}
          />
        </MenuItem>

      </div>
      <div className={classes.bottom}>
        <button
          className={classes.logoutBtn}
          onClick={() => {
            logOut();
            handleClose();
          }}
        >
          <LogOutIcon aria-hidden />
          {t('Logout')}
        </button>
      </div>
    </Menu>
  );
}

export default MenuDialog;
