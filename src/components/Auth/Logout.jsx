import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/auth/actions';
import routes from '../../config/routes';

const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(logout()).then(() => {
      localStorage.setItem('token', '');
      localStorage.setItem('user', '');
      history.push(routes.ROOT);
    }).catch((error) => {
      console.log('logout error:', error);
    });
  }, [dispatch, history]);

  return null;
};

export default Logout;
