import React, { useState } from 'react';

function RegistrationForm() {

  return (
    <section class="vh-100">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card auth-form bg-info bg-gradient text-white __border-radius">
              <div class="auth-form card-body p-5 text-center">

                <div class="mb-md-5 mt-md-4 pb-5">

                  <h2 class="fw-bold mb-2 text-uppercase">Registration</h2>
                  <p class="text-white-50 mb-5"></p>

                  <div class="input-group">
                    <input type="text" id="typeEmailX" class="answer-field" placeholder=" " />
                    <label class="answer-label" for="typeEmailX">Username</label>
                  </div>

                  <div class="input-group">
                    <input type="email" id="typeEmailX" class="answer-field" placeholder=" " />
                    <label class="answer-label" for="typeEmailX">Email</label>
                  </div>

                  <div class="input-group">
                    <input type="text" id="typeEmailX" class="answer-field" placeholder=" " />
                    <label class="answer-label" for="typeEmailX">Password</label>
                  </div>

                  <div class="input-group">
                    <input type="text" id="typeEmailX" class="answer-field" placeholder=" " />
                    <label class="answer-label" for="typeEmailX">Repeat password</label>
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
    </section>
  );
}

export default RegistrationForm;