import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StyledCheckbox from '../Checkbox/Checkbox';
// import styles from './Dropdown.module.scss';
import CheckboxGroup from '../CheckboxGroupRaw/CheckboxGroupRaw';


const useStyles = makeStyles({
  root: {
    width: '260px',
    minHeight: '30px',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(112, 112, 112, 0.24)',
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
  },

  arrowIcon: {
    fill: 'none',
    stroke: '#0085ff',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },

  expandMoreIcon: {
    color: '#0085ff',
    fill: '#0085ff',
    transform: 'rotate(-90deg)',
  },

  iconExpanded: {
    transform: 'rotate(90deg)',
  },

  summary: {
    height: '30px',
    minHeight: '30px',
  },

  expanded: {
    height: '30px',
    minHeight: '30px !important',
  },
});

export default function Dropdown({ label, items }) {
  const [itemsArray, setItemsArray] = useState([]);
  const [itemsStat, setItemsStat] = useState({ checked: 0, unchecked: 0, total: 0 });
  const classes = useStyles();

  useEffect(() => {
    const result = items.map((item) => {
      if (!item.disabled) {
        if (item.checked) {
          itemsStat.checked += 1;
        } else {
          itemsStat.unchecked += 1;
        }
        itemsStat.total += 1;
      }
      return { ...item, checked: !!item.checked };
    });

    Promise.all(result).then((resultedItems) => {
      setItemsArray(resultedItems);
      setItemsStat({ ...itemsStat });
    });
  }, [items]);

  const selectAll = useCallback((check) => {
    setItemsArray((state) => state.map((item) => {
      if (!item.disabled) {
        return { ...item, checked: check };
      }
      return { ...item };
    }));

    if (check) {
      setItemsStat({ ...itemsStat, checked: itemsStat.total, unchecked: 0 });
    } else {
      setItemsStat({ ...itemsStat, checked: 0, unchecked: itemsStat.total });
    }
  }, [itemsStat]);

  const handleCheckboxChange = useCallback((itemIdx) => {
    setItemsArray(
      (state) => state.map((item, idx) => {
        if (idx === itemIdx) {
          if (!item.checked) {
            setItemsStat({ ...itemsStat, checked: itemsStat.checked + 1, unchecked: itemsStat.unchecked - 1 });
          } else {
            setItemsStat({ ...itemsStat, checked: itemsStat.checked - 1, unchecked: itemsStat.unchecked + 1 });
          }
        }
        return { ...item, checked: idx === itemIdx ? !item.checked : item.checked };
      }),
    );
  }, [itemsStat]);

  // const ArrowIcon = () => (
  //   <SvgIcon>
  //     <path
  //       id='Path_13143'
  //       data-name='Path 13143'
  //       className={classNames(styles.arrowIcon)}
  //       d='M2360.908,1120.023l4.625,4.624,4.624-4.624'
  //       transform='translate(-2360.201 -1119.316)'
  //     />
  //   </SvgIcon>
  // );

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary
        classes={{ root: classes.summary, expanded: classes.expanded }}
        expandIcon={<ExpandMoreIcon classes={{ root: classes.expandMoreIcon }} />}
        aria-label='Expand'
        aria-controls='additional-actions1-content'
        id='additional-actions1-header'
      >
        <FormControlLabel
          aria-label='Acknowledge'
          onClick={(event) => event.stopPropagation()}
          onFocus={(event) => event.stopPropagation()}
          control={(
            <StyledCheckbox
              onChange={(e) => selectAll(e.target.checked)}
              checked={itemsStat.checked === itemsStat.total}
            />
)}
          label={label}
        />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <CheckboxGroup items={itemsArray} onChange={handleCheckboxChange} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
