import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';


function AuthForm(props) {

  let isActive = props.isActive;
  let setActive = props.setActive;
  let {loginUser} = useContext(AuthContext);

  return (
    <form onSubmit= {loginUser}>
    <section class="vh-100">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card auth-form bg-info bg-gradient text-white __border-radius">
              <div class="auth-form card-body p-5 text-center">

                <div class="mb-md-5 mt-md-4 pb-5">

                  <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                  <p class="text-white-50 mb-5">Please enter your login and password!</p>

                  <div class="input-group">
                    <input type="text" name='username' id="username" class="answer-field" placeholder=' ' />
                    <label class="answer-label" for="psername">Username</label>
                  </div>

                  <div class="input-group">
                    <input type="password" name='password' id="password" class="answer-field" placeholder=' '/>
                    <label class="answer-label" for="password">Password</label>
                  </div>

                  <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>

                  <div class="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
                    <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                    <a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
                  </div>

                </div>

                <div>
                  <p class="mb-0">Don't have an account? <a href="/registr" class="text-white-50 fw-bold">Sign Up</a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </form>
  );
}

export default AuthForm;