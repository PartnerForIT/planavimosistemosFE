import { withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles((theme) => ({
  root: {
    height: 36,
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& label.Mui-focused': {
      color: '#4d7499',
    },

    '& svg': {
      width: 10,
      marginRight: 13,
    },
  },
  input: {
    borderRadius: 4,
    width: '100%',
    position: 'relative',
    backgroundColor: '#fcfdfd',
    border: '1px solid #e2f1fd',
    fontSize: 14,
    lineHeight: '16px',
    padding: '11px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: 'none',
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      borderColor: '#0087ff',
    },
  },
}))(InputBase);

export default BootstrapInput;
