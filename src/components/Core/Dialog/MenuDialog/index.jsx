import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Menu, MenuItem,} from '@material-ui/core';
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

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  const [expanded, setExpanded] = useState(false);

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
          <LanguageDropdown expanded={expanded} setExpanded={setExpanded} />
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
