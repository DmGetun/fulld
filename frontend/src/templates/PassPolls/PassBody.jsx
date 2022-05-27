import axios from 'axios';
import { Route, useParams, Routes } from "react-router";
import { Container } from "reactstrap";
import PassPollBody from './PassPollBody'
import { useState, useEffect } from "react";
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { API_URL_TAKE_POLL } from '../static/constants';

function PassBody(props) {

  let {authTokens, logoutUser} = useContext(AuthContext);
  let params = useParams();
  let slug = params.slug;

  return (    
    <Routes>
      <Route path = '/' element = {<PassPollBody slug={slug} />}></Route>
      <Route path = '/info' element = {<PassPollBody/>}></Route>
      <Route path = '/slug' element = {<PassPollBody/>}></Route>
    </Routes>
  );
}


export default PassBody;
