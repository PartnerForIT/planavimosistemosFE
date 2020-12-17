import React from 'react';
import { useTranslation } from 'react-i18next';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';
import classes from '../Roles.module.scss';
import Tooltip from '../../../../Core/Tooltip';
import styles from '../../../../Core/DataTableCustom/DTM.module.scss';

function Content({ children, title = '', tooltip = '' }) {
  const { t } = useTranslation();
  return (
    <div className={classes.details_inner}>
      <div className={classes.details_inner_title}>
        <p>
          {t(title)}
          {' '}
          <span><Tooltip title={t(tooltip)} /></span>
        </p>
        <div className={classes.content}>
          <Scrollbar
            className='scrollableContentClasses'
            style={{ height: 447 }}
            removeTracksWhenNotUsed
            trackXProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <span
                    {...restProps}
                    ref={elementRef}
                    className={classNames(styles.scrollbarTrackX, { trackX: true })}
                  />
                );
              },
            }}
            trackYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <span
                    {...restProps}
                    ref={elementRef}
                    className={classNames(styles.scrollbarTrackY, { trackY: true })}
                  />
                );
              },
            }}
          >
            {children}
          </Scrollbar>
        </div>
      </div>
    </div>
  );
}

export default Content;
