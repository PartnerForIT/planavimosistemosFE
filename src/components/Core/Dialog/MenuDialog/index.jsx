import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from '@material-ui/core';
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
  border: '1px solid #d0dfef',
  boxShadow: '0 3px 16px #e2e9ed',
};

const LogoutMenuItem = withStyles(() => ({
  root: {
    padding: 0,
    margin: 6,
    background: 'white',
    borderRadius: 6,
    height: 43,
    position: 'relative',
    overflow: 'visible',
    '&:hover': {
      backgroundColor: '#F6FAFD',
    },
    '&:focus': {
      backgroundColor: '#F6FAFD',
    },
    // '&::after': {
    //   content: "''",
    //   position: 'absolute',
    //   width: '100%',
    //   height: 1,
    //   backgroundColor: '#d0dfef82',
    //   display: 'block',
    //   top: -6,
    // },
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

  const onChangeLanguage = (language) => {
    localStorage.setItem('i18nextLng', language);
    changeLanguage(language);
    setLanguage(language);
    handleClose();
    window.location.reload();
  }

  // useEffect(() => {
  //   if (expanded && language !== localStorage.getItem('i18nextLng')) {
  //     localStorage.setItem('i18nextLng', language);
  //     changeLanguage(language);
  //     setLanguage(language);
  //     handleClose();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [language, expanded]);

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
        onClick={passwordClick}
        role='button'
        aria-label='change password'
      >
        <button
          className={classes.changePass}
          onClick={passwordClick}
        >
          <LockIcon aria-hidden className={classes.changePass__icon} />
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
          setLanguage={onChangeLanguage}
        />
      </MenuItem>
      <div className={classes.menu__hr} />
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
          <LogOutIcon aria-hidden className={classes.logoutBtn__icon} />
          {t('Log out')}
        </button>
      </LogoutMenuItem>
    </Menu>
  );
}

export default MenuDialog;
