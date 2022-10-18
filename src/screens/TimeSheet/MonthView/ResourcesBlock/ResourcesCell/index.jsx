import React, {
} from 'react';

import classes from './ResourcesCell.module.scss';
import avatar from '../../../../../components/Icons/avatar.png';

const ResourceCell = ({
  title,
  skill,
  place,
  photo,
  height = (41*3)+7
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
