import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import StyledCheckbox from '../Checkbox/Checkbox';
import styles from './CheckboxGroup.module.scss';

export default function CheckboxGroup({
  items, children, selectAll, itemsStat, height,
}) {
  const { t } = useTranslation();

  // const [itemsArray, setItemsArray] = useState([]);
  // const [itemsStat, setItemsStat] = useState(itemsStatObj || { checked: 0, unchecked: 0, total: 0 });

  // useEffect(() => {
  //   if (items && items.length) {
  //     const result = items.map((item) => {
  //       if (!item.disabled) {
  //         if (item.checked) {
  //           itemsStat.checked += 1;
  //         } else {
  //           itemsStat.unchecked += 1;
  //         }
  //         itemsStat.total += 1;
  //       }
  //       return { ...item, checked: !!item.checked };
  //     });
  //
  //     Promise.all(result).then((resultedItems) => {
  //       setItemsArray(resultedItems);
  //       setItemsStat({ ...itemsStat });
  //     });
  //   }
  // }, [items]);
  //
  // const selectAllOld = useCallback((check) => {
  //   setItemsArray((state) => state.map((item) => {
  //     if (!item.disabled) {
  //       return { ...item, checked: check };
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

  return (
    <div className={classNames(styles.checkboxGroup)}>
      <div className={classNames(styles.headerRow)}>
        <button
          className={classNames(styles.button)}
          onClick={() => selectAll(true)}
          disabled={itemsStat.checked === itemsStat.total}
        >
          {t('Select All')}
        </button>
        <button
          className={classNames(styles.button)}
          onClick={() => selectAll(false)}
          disabled={itemsStat.unchecked === itemsStat.total}
        >
          {t('Select None')}
        </button>
      </div>
      <div className={classNames(styles.contentBox)} style={height ? { height } : null}>
        {
          children || items.map((item, idx) => (
            <StyledCheckbox
              key={idx.toString()}
              label={item.label}
              checked={item.checked}
              disabled={item.disabled}
              onChange={() => console.log(idx)}
            />
          ))
        }
      </div>
    </div>
  );
}
