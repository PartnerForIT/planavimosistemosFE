import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TriangleIcon from '../../Icons/TriangleIcon';
import classNames from 'classnames';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import StyledCheckbox from '../Checkbox/Checkbox';
import styles from './Dropdown.module.scss';
import CheckboxGroup from '../CheckboxGroupRaw/CheckboxGroupRaw';

const useStyles = makeStyles({
  root: {
    minHeight: '30px',
    boxShadow: 'none',
    '&::before': {
      display: 'none',
    },
  },

  rootExpanded: {
    margin: '0px !important',
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 0 0 26px',
  },

  summary: {
    minHeight: '35px',
    paddingLeft: '0',
    paddingRight: 0,
    justifyContent: 'flex-start',

    '&::after': {
      content: "''",
      position: 'absolute',
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: 'rgba(112, 112, 112, 0.24)',
      display: 'block',
      bottom: 0,
    },
  },

  summaryContent: {
    margin: '0 !important',
    flexGrow: 0,
  },

  summaryExpanded: {
    minHeight: '35px !important',

    '&::after': {
      left: 27,
    },
  },
});

const isChecked = (items) => {
  return items.every(item => {
    if (Array.isArray(item.items)) {
      return isChecked(item.items)
    }
    return Boolean(item.checked)
  })
}

export default function Dropdown({
  currentItem, label, items, checked, onChange,
  choiceOfOnlyOne,
}) {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  const renderCheckboxGroup = (arr) => (
    <CheckboxGroup
      className={styles.checkboxGroupItem}
      items={arr ?? items}
      onChange={(item, checked) => {
        onChange(item, !checked)
      }}
    />
  );

  const renderDropdown = () => (
    <Accordion
      classes={{
        root: classes.root,
        expanded: classes.rootExpanded,
      }}
      onChange={(e, state) => {
        setExpanded(state);
      }}
    >
      <AccordionSummary
        classes={{
          root: classes.summary,
          expanded: classes.summaryExpanded,
          content: classes.summaryContent,
        }}
        expandIcon={(
          
          <TriangleIcon
            className={classNames(styles.expandIcon, expanded ? styles.expandIconExpanded : '')}
          />
        )}
        aria-label='Expand'
        aria-controls='additional-actions1-content'
        id='additional-actions1-header'
      >
        <FormControlLabel
          aria-label='Acknowledge'
          onClick={(event) => event.stopPropagation()}
          onFocus={(event) => event.stopPropagation()}
          className={styles.checkboxLabel}
          control={(
            <StyledCheckbox
              onChange={() => {
                if (!choiceOfOnlyOne) {
                  onChange(currentItem, !checked);
                }
              }}
              checked={checked}
            />
          )}
          label={label}
        />
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {
          items.map((item, idx) => (
            item?.type === 'group'
              ? (
                <Dropdown
                  key={item.label + idx.toString()}
                  label={item.label}
                  currentItem={item}
                  checked={isChecked(item.items)}
                  items={item.items}
                  onChange={onChange}
                  choiceOfOnlyOne={choiceOfOnlyOne}
                />
              )
              : (
                <React.Fragment key={item.label + idx.toString()}>
                  {renderCheckboxGroup([item])}
                </React.Fragment>
              )
          ))
        }
      </AccordionDetails>
    </Accordion>
  );

  return (
    renderDropdown()
  );
}
