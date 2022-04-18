import React, { useState } from 'react';
import axios from 'axios';

function RegistrationForm() {
  
  let [inputValues,SetInputValue] = useState([]);

  function setValue(e) {
    let id = e.target.id;
    let value = e.target.value;
    SetInputValue({ ...inputValues,[id]: value });
  }

  return (
    <section class="vh-100">
      <form onSubmit={e => RegistrUser(e)}>
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card auth-form bg-info bg-gradient text-white __border-radius">
              <div class="auth-form card-body p-5 text-center">

                <div class="mb-md-5 mt-md-4 pb-5">

                  <h2 class="fw-bold mb-2 text-uppercase">Registration</h2>
                  <p class="text-white-50 mb-5"></p>

                  <div class="input-group">
                    <input type="text" id="Username" class="answer-field" placeholder=" " onChange={e => setValue(e)}/>
                    <label class="answer-label" for="typeUsername">Username</label>
                  </div>

                  <div class="input-group">
                    <input type="email" id="Email" class="answer-field" placeholder=" " onChange={e => setValue(e)}/>
                    <label class="answer-label" for="typeEmailX">Email</label>
                  </div>

                  <div class="input-group">
                    <input type="text" id="Password" class="answer-field" placeholder=" " onChange={e => setValue(e)}/>
                    <label class="answer-label" for="typePassword">Password</label>
                  </div>

                  <div class="input-group">
                    <input type="text" id="RepeatPassword" class="answer-field" placeholder=" " onChange={e => setValue(e)}/>
                    <label class="answer-label" for="typeRepeatPassword">Repeat password</label>
                  </div>

                  <button class="btn btn-outline-light btn-lg px-5" type="submit">Registr</button>

                  <div class="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
                    <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                    <a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </form>
    </section>
  );

  function RegistrUser(e){
    e.preventDefault();
    const apiURL = 'http://127.0.0.1:8000/add_opros';
    let user = inputValues;
    if (user['Password'] !== user['RepeatPassword']) { return; }
    
    axios({
      method: 'post',
      url: apiURL,
      data: user
    })
  }
}

export default RegistrationForm;