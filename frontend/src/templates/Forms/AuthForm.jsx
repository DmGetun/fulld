import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router';
import './style.css';


function AuthForm(props) {

  let isActive = props.isActive;
  let setActive = props.setActive;
  let {loginUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || '/';
  const goBack = () => navigate(-1);

  function FormSubmit(e) {
    const success = () => navigate(fromPage);
    loginUser(e, success);
  }

  return (
    <div class='container'>
      <div class='frame'>
      <form class="form-signin" action="" method="post" name="form" onSubmit={(e) => FormSubmit(e)}>
          <label for="username">Username</label>
          <input class="form-styling" type="text" name="username" placeholder=""/>
          <label for="password">Password</label>
          <input class="form-styling" type="text" name="password" placeholder=""/>
          <input type="checkbox" id="checkbox"/>
          <label for="checkbox" ><span class="ui"></span>Keep me signed in</label>
          <button class="btn-animate">
            <a class="btn-signin" type='submit'>Sign in</a>
          </button>
				</form>
      </div>
    </div>
  );
}

export default AuthForm;