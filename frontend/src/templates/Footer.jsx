import React from 'react';
import { Link } from 'react-router-dom';
import { Button, NavLink } from 'reactstrap';
import RegButton from './Buttons/RegButton';
import AuthButton from './Buttons/AuthButton';

function Footer() {
  return (
    <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <a href="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
        <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
      </a>
      <nav>
      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <NavLink tag={Link} to='/'>Главная</NavLink>
        <NavLink tag={Link} to='/opros'>Пройти опрос</NavLink>
        <NavLink tag={Link} to='/create'>Создать опрос</NavLink>
      </ul>
      </nav>

      <div class="col-md-3 text-end">
        <button type="button" class="auth-button btn btn-primary">Войти</button>
        <button type="button" class="btn btn-outline-primary">Регистрация</button>
      </div>
    </header>
  </div>
  );
}

export default Footer;
