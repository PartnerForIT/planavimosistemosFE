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
import CheckedLanguage from '../../../Icons/CheckedLanguage';
import EngLang from '../../../Icons/EngLang';
import LtLang from '../../../Icons/LtLang';

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
    color: '#808f94',
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

function LanguageDropdown({
  expanded, setExpanded, language = '', setLanguage = () => ({}),
}) {
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
        <GlobeIcon aria-hidden />
        {t('Change language')}
      </AccordionSummary>
      <AccordionDetails className={st.details}>
        <ul>

          <Lang
            value='en'
            language={language}
            name={t('English')}
            setLanguage={setLanguage}
          >
            <EngLang aria-hidden />
          </Lang>
          <Lang
            value='lt'
            language={language}
            name={t('Lithuanian')}
            setLanguage={setLanguage}
          >
            <LtLang aria-hidden />
          </Lang>

        </ul>
      </AccordionDetails>

    </Accordion>
  );
}

export default LanguageDropdown;

const Lang = ({
  value, name, language, children, setLanguage = () => ({}),
}) => (
  <MenuItem
    value={value}
    className={classnames(classes.menu_item, classes.language_item, language === value ? classes.active : '')}
  >
    <button className={classes.btn} onClick={() => setLanguage(value)}>
      {children}
      {name}
      { language === value
        && <CheckedLanguage className={classes.status} />}
    </button>
  </MenuItem>
);
