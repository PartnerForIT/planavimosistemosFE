import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root1: {
    width: "2em",
    height: "2em",
  },
  root2: {
    width: "1em",
    height: "1em",
  },
}));

export default function CategoriesIcon({ viewBox, fill }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox={viewBox ? viewBox : '0 0 18.77 13.662'} className={viewBox ? classes.root1 : classes.root2}>
      <path id="13488" data-name="13488" d="M-8.174-11.064a1.213,1.213,0,0,0,1.221-1.211,1.213,1.213,0,0,0-1.221-1.211,1.211,1.211,0,0,0-1.211,1.211A1.211,1.211,0,0,0-8.174-11.064Zm4.17-.42h12.6a.776.776,0,0,0,.791-.791.776.776,0,0,0-.791-.791H-4a.782.782,0,0,0-.791.791A.788.788,0,0,0-4-11.484Zm-4.17,6.035A1.213,1.213,0,0,0-6.953-6.66,1.213,1.213,0,0,0-8.174-7.871,1.211,1.211,0,0,0-9.385-6.66,1.211,1.211,0,0,0-8.174-5.449ZM-4-5.869h12.6a.776.776,0,0,0,.791-.791.782.782,0,0,0-.791-.791H-4a.782.782,0,0,0-.791.791A.782.782,0,0,0-4-5.869ZM-8.174.176A1.221,1.221,0,0,0-6.953-1.045,1.219,1.219,0,0,0-8.174-2.256,1.217,1.217,0,0,0-9.385-1.045,1.219,1.219,0,0,0-8.174.176ZM-4-.254h12.6a.776.776,0,0,0,.791-.791.782.782,0,0,0-.791-.791H-4a.788.788,0,0,0-.791.791A.782.782,0,0,0-4-.254Z" transform="translate(9.385 13.486)" fill={fill ? fill : '#808f94'} />
    </SvgIcon>
  )
}

















