import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import classNames from 'classnames';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({
  root: {
    boxShadow: 'none !important',
    padding: (props) => props.paddingRoot,

    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },

  icon: {
    borderRadius: (props) => props.borderRadius,
    border: '1px solid #A2C2E3',
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    boxShadow: 'none !important',
    // boxShadow: 'inset 0 0 0 1px rgba(16, 22, 26, 0.2), inset 0 -1px 0 rgba(16, 22, 26, 0.1)',

    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19, 124, 189, 0.6)',
      outlineOffset: 2,
    },

    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },

    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206, 217, 224, 0.5)',

      ':hover': {
        backgroundColor: 'rgba(206, 217, 224, 0.5)',
      },
    },
  },

  checkedIcon: {
    boxShadow: 'none !important',
    backgroundColor: '#FFBF23',
    backgroundImage: 'linear-gradient(180deg, hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0))',

    '&::before': {
      display: 'block',
      width: 16,
      height: 16,
      // marginLeft: 1,
      // marginTop: 2,
      // backgroundRepeat: 'no-repeat',
      // backgroundImage:
      //   "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='13' height='12' "
      // + "viewBox='0 0 10.663 5.831'%3e%3cdefs%3e%3cstyle%3e .cls-1 %7b fill: none; stroke: %23fff; stroke-linecap: "
      //  + "round; stroke-linejoin: round;%7d %3c/style%3e%3c/defs%3e%3cpath id='Path_13143' data-name='Path 13143' "
      //     + "class='cls-1' d='M2360.908,1120.023l4.625,4.624,4.624-4.624' "
      //     + "transform='translate(-2360.201 -1119.316)'/%3e%3c/svg%3e \")",
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath"
        + " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 "
        + "00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' "
        + "fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },

    'input:hover ~ &': {
      backgroundColor: '#006EFF',
    },
  },

  labelRoot: {
    boxShadow: 'none !important',
    marginLeft: '0px',
    marginRight: '0px',
    display: 'flex',
    flexShrink: 0,
  },

  label: {
    boxShadow: 'none !important',
    color: '#333945',
    fontFamily: 'Helvetica Neue, sans-serif',
    fontSize: '15px',
    marginLeft: 0,
    textAlign: 'left',
    wordWrap: 'break-word',
    width: 'calc(100% - 18px)',
  },
});

export default function StyledCheckbox({
  borderRadius = 2, paddingRoot,
  item, label = '', id, onChange = () => ({}), ...props
}) {
  const classes = useStyles({ borderRadius, paddingRoot });

  return (
    <FormControlLabel
      classes={{
        root: classes.labelRoot,
        label: classes.label,
      }}
      control={(
        <Checkbox
          className={classes.root}
          disableRipple
          color='default'
          checkedIcon={<span className={classNames(classes.icon, classes.checkedIcon)} />}
          icon={<span className={classes.icon} />}
          inputProps={{ 'aria-label': '' }}
          onChange={(e) => onChange(item || id, e.target.checked, e)}
          {...props}
        />
      )}
      label={label}
    />

  );
}
