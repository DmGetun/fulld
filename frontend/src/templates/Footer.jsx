import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, NavLink } from 'reactstrap';
import RegButton from './Buttons/RegButton';
import AuthButton from './Buttons/AuthButton';
import AuthContext from '../context/AuthContext';
import LogoutButton from './Buttons/LogoutButton';

function Footer() {

  let {user, logoutUser} = useContext(AuthContext)
  return (
    <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <a href="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
        <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
      </a>
      <nav>
      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <NavLink className='link' tag={Link} to='/'>Главная</NavLink>
        <NavLink className='link' tag={Link} to='/opros'>Пройти опрос</NavLink>
        <NavLink className='link' tag={Link} to='/create'>Создать опрос</NavLink>
        <NavLink className='link' tag={Link} to='/polls'>Мои опросы</NavLink>
      </ul>
      </nav>
      { user && <p>Hello, {user.user_id}</p> }
        { !user ? (
        <div class="text-end">
        <AuthButton/>
        <RegButton/>
        </div>
        ): (
        <LogoutButton/>
        )}
    </header>
  </div>
  );
}

export default Footer;
