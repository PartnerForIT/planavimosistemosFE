import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from '@material-ui/core';
import classnames from 'classnames';
import Button from '../../Button/Button';
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
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng'));

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    localStorage.setItem('i18nextLng', language);
  }, [language]);

  return (
    <Menu
      onClose={handleClose}
      open={open}
      className={classes.menu}
      disablePortal
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
          <LockIcon />
          {t('Change password')}
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
        <Button
          inverse
          fillWidth
          size='big'
          onClick={() => {
            logOut();
            handleClose();
          }}
        >
          <LogOutIcon className={classes.icon} />
          {t('Logout')}
        </Button>
      </div>
    </Menu>
  );
}

export default MenuDialog;
