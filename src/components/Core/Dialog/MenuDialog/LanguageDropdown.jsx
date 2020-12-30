import React from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, MenuItem,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import GlobeIcon from '../../../Icons/GlobeIcon';

import classes from './MenuDialog.module.scss';

const useStyles = makeStyles({
  root: {
    minHeight: 24,
    boxShadow: 'none',
    background: 'unset',
    width: '100%',
    marginBottom: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },

  rootExpanded: {
    '&:first-child': {
      marginBottom: 0,
    },
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    position: 'unset',
  },

  summary: {
    height: 24,
    minHeight: 24,
    padding: 0,
    position: 'unset',
  },

  content: {
    display: 'flex',
    alignItems: 'center',
  },

  expanded: {
    height: 24,
    minHeight: '24px !important',
  },

  icon: {
    position: 'absolute',
    right: 0,
  },
});

function LanguageDropdown({ expanded, setExpanded }) {
  const { t } = useTranslation();
  const st = useStyles();

  return (
    <Accordion
      classes={{
        root: st.root,
        expanded: st.rootExpanded,
      }}
      onChange={(e, state) => {
        setExpanded(state);
      }}
    >
      <AccordionSummary
        classes={{
          root: st.summary,
          expanded: st.expanded,
          content: st.content,
          expandIcon: st.icon,
        }}
        expandIcon={(
          <ExpandMoreIcon
            className={classnames(classes.expandIcon, expanded ? classes.expandIconExpanded : '')}
          />
                )}
        aria-label='Expand'
        aria-controls='additional-actions1-content'
        id='additional-actions1-header'
      >
        <GlobeIcon />
        {t('Change language')}
      </AccordionSummary>
      <AccordionDetails className={st.details}>
        <ul>
          <MenuItem className={classes.menu_item}>lang 1</MenuItem>
          <MenuItem className={classes.menu_item}>lang 2</MenuItem>
          <MenuItem className={classes.menu_item}>lang 3</MenuItem>
          <MenuItem className={classes.menu_item}>lang 4</MenuItem>
        </ul>
      </AccordionDetails>

    </Accordion>
  );
}

export default LanguageDropdown;
