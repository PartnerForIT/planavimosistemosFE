import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Menu, MenuItem } from '@material-ui/core';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import classes from './MenuDialog.module.scss';
import LockIcon from '../../../Icons/LockIcon';
import LogOutIcon from '../../../Icons/LogOutIcon';
import LanguageDropdown from './LanguageDropdown';
import { onKeyDown } from '../../../Helpers';

const paperStyle = {
  transform: 'translateY(45px)',
  zIndex: 999,
  minWidth: 250,
  minHeight: 100,
  fontSize: 14,
};

const LogoutMenuItem = withStyles(() => ({
  root: {
    padding: 0,
    margin: '20px 6px 6px 6px',
    background: 'white',
    borderRadius: 6,
    position: 'relative',
    overflow: 'visible',
    fontFamily: 'Helvetica Neue, sans-serif',
    '&:hover': {
      backgroundColor: '#d0dfef82',
    },
    '&:focus': {
      backgroundColor: '#d0dfef82',
    },
    '&::after': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: 1,
      backgroundColor: '#d0dfef82',
      display: 'block',
      top: -6,
    },
  },
}))(MenuItem);

function MenuDialog({
  open, anchorEl = null, setAnchorEl, setMenuOpen, logOut = () => ({}),
  editPassword = () => ({}), changeLanguage = () => ({}),
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng'));

  const handleClose = (event) => {
    if (!(event?.key === 'Tab')) {
      setMenuOpen(false);
      setAnchorEl(null);
      setExpanded(false);
    }
  };

  useEffect(() => {
    if (expanded && language !== localStorage.getItem('i18nextLng')) {
      localStorage.setItem('i18nextLng', language);
      changeLanguage(language);
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, expanded]);

  const passwordClick = () => {
    editPassword();
    handleClose();
  };

  const logoutFlow = () => {
    logOut();
    handleClose();
  };

  return (
    <Menu
      onClose={handleClose}
      open={open}
      className={classes.menu}
      anchorEl={anchorEl}
      autoFocus
      role='menu'
      style={{ transformOrigin: 'center bottom', position: 'absolute' }}
      PaperProps={{
        style: paperStyle,
      }}
      MenuListProps={{
        style: {
          minWidth: 200, width: '100%', paddingBottom: 0, paddingTop: 0,
        },
        disableListWrap: true,
      }}
    >

      <MenuItem
        className={classes.menu_item}
        autoFocus
        onKeyDown={(e) => onKeyDown(e, () => passwordClick())}
        role='button'
        aria-label='change password'
      >
        <button
          className={classes.changePass}
          onClick={passwordClick}
        >
          <LockIcon aria-hidden />
          {t('Change password')}
        </button>
      </MenuItem>
      <MenuItem
        aria-hidden
        className={classnames(classes.menu_item, expanded ? classes.language : '')}
      >
        <LanguageDropdown
          expanded={expanded}
          setExpanded={setExpanded}
          language={language}
          setLanguage={setLanguage}
        />
      </MenuItem>
      <LogoutMenuItem
        onKeyDown={(e) => {
          onKeyDown(e, () => logoutFlow());
        }}
        role='button'
        aria-label='logout'
      >
        <button
          className={classes.logoutBtn}
          onClick={logoutFlow}
        >
          <LogOutIcon aria-hidden />
          {t('Logout')}
        </button>
      </LogoutMenuItem>
    </Menu>
  );
}

export default MenuDialog;
