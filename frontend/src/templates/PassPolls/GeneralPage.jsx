import axios from 'axios';
import { Route, useParams, Routes } from "react-router";
import { Container } from "reactstrap";
import PassPollBody from './PassPollBody'
import { useState, useEffect } from "react";
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { API_URL_TAKE_POLL } from '../static/constants';

function GeneralPage(props) {

  return (
      <h1>Вы находитесь на главной странице прохождения опросов. Пожалуйста, укажите ссылку на существующий опрос</h1>
  );
}


export default GeneralPage;
