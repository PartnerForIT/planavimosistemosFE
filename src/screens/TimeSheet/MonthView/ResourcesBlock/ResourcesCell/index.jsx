import React, {
} from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import classes from './ResourcesCell.module.scss';
import avatar from '../../../../../components/Icons/avatar.png';

const ResourceCell = ({
  title,
  skill,
  place,
  photo,
  height = 43*3
}) => {

  return (
    <>
      <div className={classes.resourcesCell} style={{"height" : height+"px"}}>
        <div className={classes.resourcesCell__content}>
          
          <div className={classes.resourcesCell__content__avatar}>
            <img src={photo || avatar} alt={title} />
          </div>
          <div className={classes.resourcesCell__content__name}>
            { title ? <div>{title}</div> : null }
            { skill ? <div>{skill}</div> : null }
            { place ? <div>{place}</div> : null }
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceCell;
