import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './InputAddress.module.scss';
import SearchMapIcon from '../../Icons/SearchMapIcon';
import FitMapIcon from '../../Icons/FitMapIcon';
import PointMapIcon from '../../Icons/PointMapIcon';
import CancelMapIcon from '../../Icons/CancelMapIcon';
import SelectMapIcon from '../../Icons/SelectMapIcon';
import Tooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next';

const InputAddress = ({
  onSearch, places, onCancel, onSelect, onClear, onClickItem, onFit, onPoint,
  disabled, placeholder, type, width, height,
  min, max, fullWidth, underlined, error, light, value='', ...props
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(false);
  const classes = classNames(
    styles.input,
    { [styles.underlined]: underlined },
    { [styles.error]: error },
    { [styles.light]: light },
  );

  const wrapperClasses = classNames(
    styles.inputWrapper,
    { [styles.inputWrapperFullWidth]: fullWidth },
  );

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={wrapperClasses} style={{ width }}>
      <input
        style={{ width: '100%', height }}
        className={classes}
        type={type || 'text'}
        min={min || ''}
        max={max || ''}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onKeyPress={handleKeyPress}
        {...props}
      />
      { value &&
        <div className={classNames(styles.iconClearWrapper)} onClick={onClear}>
          <CancelMapIcon />
        </div>
      }
      <div className={classNames(styles.iconWrapper)} onClick={onSearch}>
        <SearchMapIcon />
      </div>
      { places && places.length > 0 && (
        <div className={styles.predictions}>
          <div className={styles.predictions__list}>
            {places.map(({ description }, index) => (
              <div
                key={index+'result'}
                onClick={() => { setSelected(index); onClickItem(description); }}
                className={classNames(styles.predictions__item, {[styles.predictions__item__selected]: selected === index})}
              >
                {description.includes(value) ? (
                  <>
                    {description.split(value).map((part, i) => (
                      <>
                        {i > 0 && <strong>{value}</strong>}
                        {part}
                      </>
                    ))}
                  </>
                ) : (
                  description
                )}
              </div>
            ))}
          </div>
          <div className={styles.predictions__footer}>
            <div>
              { selected !== false && (
                <span onClick={onFit} data-tip={t('Fit to screen')} data-for='google_marker_button' className={styles.predictions__fit}>
                  <FitMapIcon />
                </span>
              )}
              { selected !== false && (
                <span onClick={onPoint} data-tip={t('Location')} data-for='google_marker_button' className={styles.predictions__point}>
                  <PointMapIcon />
                </span>
              )}
              { selected !== false && (
                <Tooltip
                  id='google_marker_button'
                  className='schedule-screen__tooltip__black'
                  effect='solid'
                  placement='bottom'
                />
              )}
            </div>
            <div>
              <span onClick={() => { onCancel(); setSelected(false); }} className={styles.predictions__cancel}>
                <CancelMapIcon />
                {t('Cancel')}
              </span>
              { selected !== false && (
                <span onClick={() => { onSelect(places[selected]?.description); setSelected(false); }} className={styles.predictions__select}>
                  <SelectMapIcon />
                  {t('Select')}
                </span>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};
export default InputAddress;
