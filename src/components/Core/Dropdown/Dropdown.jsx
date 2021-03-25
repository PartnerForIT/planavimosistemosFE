import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import StyledCheckbox from '../Checkbox/Checkbox';
import styles from './Dropdown.module.scss';
import CheckboxGroup from '../CheckboxGroupRaw/CheckboxGroupRaw';

const useStyles = makeStyles({
  root: {
    minHeight: '30px',
    boxShadow: 'none',
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
    height: '35px',
    minHeight: '35px',
    paddingLeft: '3px',
    paddingRight: 12,

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

  summaryExpanded: {
    height: '35px',
    minHeight: '35px !important',

    '&::after': {
      left: 27,
    },
  },
});

export default function Dropdown({
  currentItem, label, items, checked, onChange,
  isSubDropdown,
}) {
  const [expanded, setExpanded] = useState(false);
  const [itemsArray, setItemsArray] = useState([]);
  const [itemsStat, setItemsStat] = useState({ checked: 0, unchecked: 0, total: 0 });
  const classes = useStyles();

  useEffect(() => {
    let result;
    if (typeof items !== 'undefined') {
      result = items.map((item) => {
        if (!item.disabled) {
          if (item.checked) {
            itemsStat.checked += 1;
          } else {
            itemsStat.unchecked += 1;
          }
          itemsStat.total += 1;
        }
        return { ...item, checked: !!item.checked, type: item.type ? item.type : 'item' };
      });
    } else {
      result = [];
    }

    Promise.all(result).then((resultedItems) => {
      setItemsArray(resultedItems);
      setItemsStat({ ...itemsStat });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);
  // const selectAll = useCallback((check) => {
  //   setItemsArray((state) => state.map((item) => {
  //     if (item.type === 'group') {
  //       item.items.map((checkbox) => {
  //         if (!checkbox.disabled) {
  //           return { ...checkbox, checked: check };
  //         }
  //         return { ...checkbox };
  //       });
  //     } else {
  //       if (!item.disabled) {
  //         return { ...item, checked: check };
  //       }
  //       return { ...item };
  //     }
  //     return { ...item };
  //   }));
  //
  //   if (check) {
  //     setItemsStat({ ...itemsStat, checked: itemsStat.total, unchecked: 0 });
  //   } else {
  //     setItemsStat({ ...itemsStat, checked: 0, unchecked: itemsStat.total });
  //   }
  // }, [itemsStat]);
  //
  // const handleCheckboxChange = useCallback((itemIdx) => {
  //   setItemsArray(
  //     (state) => state.map((item, idx) => {
  //       if (idx === itemIdx) {
  //         if (!item.checked) {
  //           setItemsStat({ ...itemsStat, checked: itemsStat.checked + 1, unchecked: itemsStat.unchecked - 1 });
  //         } else {
  //           setItemsStat({ ...itemsStat, checked: itemsStat.checked - 1, unchecked: itemsStat.unchecked + 1 });
  //         }
  //       }
  //       return { ...item, checked: idx === itemIdx ? !item.checked : item.checked };
  //     }),
  //   );
  // }, [itemsStat]);

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

  const renderCheckboxGroup = (arr) => (
    <CheckboxGroup
      className={styles.checkboxGroupItem}
      items={arr ?? itemsArray}
      onChange={onChange}
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
        }}
        expandIcon={(
          <ExpandMoreIcon
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
          control={(
            <StyledCheckbox
              onChange={() => onChange(currentItem)}
              checked={checked}
            />
          )}
          label={label}
        />
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {
          itemsArray.map((item, idx) => (
            item?.type === 'group'
              ? (
                <Dropdown
                  key={item.label + idx.toString()}
                  label={item.label}
                  currentItem={item}
                  checked={item.checked}
                  items={item.items}
                  onChange={onChange}
                  isSubDropdown
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
