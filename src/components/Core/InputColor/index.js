import React, { useState } from 'react';
import classNames from 'classnames';
import style from './InputColor.module.scss';
import { useTranslation } from 'react-i18next';

const InputColor = ({ value, handleInputChange, placeholder }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const bright_colors = [['#F23D79', '#F23DB6', '#F23DF2', '#B63DF2', '#793DF2', '#3D3DF2', '#3D79F2', '#3DB6F2',
    '#3DF2F2', '#3DF2B6', '#3DF279', '#3DF23D', '#79F23D', '#B6F23D', '#F2F23D', '#F2B63D', '#F2793D', '#F23D3D']];

  const calm_colors = [['#CC527A', '#CC52A3', '#CC52CC', '#7A3D99', '#7A52CC', '#5252CC', '#527ACC', '#52A3CC', '#52CCCC',
    '#52CCA3', '#52CC7A', '#52CC52', '#7ACC52', '#A3CC52', '#CCCC52', '#CCA352', '#CC7A52', '#CC5252']];

  return (
    <div className={style.color_picker}>
      <div className={style.color_picker__wrapper}>
        <button
          className={style.color_picker__button}
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: value || '#ffffff' }}
        >
          <span
            className={classNames(style.color_picker__placeholder, {
              [style.white]: value
            })}
          >
            {placeholder}
          </span>
          <span className={classNames(style.color_picker__arrow, {
            [style.active]: isOpen
          })}></span>
        </button>

        {isOpen && (
          <div className={style.color_picker__dropdown}>
            <p className={style.color_picker__header}>{placeholder}</p>
            <p className={style.color_picker__category}>{t('Bright')}</p>
            {bright_colors.map((row, rowIndex) => (
              <div key={rowIndex} className={style.color_picker__row}>
                {row.map((color, index) => (
                  <button
                    key={index}
                    className={classNames(style.color_picker__option, {
                      [style.color_picker__option_selected]: value === color
                    })}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      handleInputChange(color);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            ))}
            <p className={style.color_picker__category}>{t('Calm')}</p>
            {calm_colors.map((row, rowIndex) => (
              <div key={rowIndex} className={style.color_picker__row}>
                {row.map((color, index) => (
                  <button
                    key={index}
                    className={classNames(style.color_picker__option, {
                      [style.color_picker__option_selected]: value === color
                    })}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      handleInputChange(color);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputColor;