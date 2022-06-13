import PollBody from './templates/Polls/PollBody'
import './App.css';
import Layout from './templates/Layout'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import Banner from './templates/Banner';
import AuthForm from './templates/Forms/AuthForm';
import PassBody from './templates/PassPolls/PassBody';
import CreatePollBody from './templates/CreatePoll/CreatePollBody';
import RegistrationForm from './templates/Forms/RegistrationForm';
import PrivateRoute from './utils/PrivateRoute';
import AuthProvider from './context/AuthContext';
import Polls from './templates/user/polls';
import GeneralPage from './templates/PassPolls/GeneralPage';
import ResultPoll from './templates/result/Result';


function App() {
  return (
    <div className='body justify-content-center'>
          <Layout>
            <Routes>
              <Route path='/' element = {<Banner/>}/>
              <Route path='/user/registr' element = {<RegistrationForm/>}/>
              <Route path='/user/login' element={<AuthForm/>}/>
              
              <Route path='/polls' element={
                <PrivateRoute>
                  <Polls/>
                </PrivateRoute>
              }/>
              
              <Route exact path='/opros/' element={
                <PrivateRoute>
                  <GeneralPage/>
                </PrivateRoute>
              }/>

              <Route path='/opros/:slug/*' element={
                <PrivateRoute>
                  <PassBody/>
                </PrivateRoute>
              }/>
              
              <Route path='/create' element={
                <PrivateRoute>
                  <CreatePollBody/>
                </PrivateRoute>
              }/>
              <Route path='/result/:slug' element={
                <PrivateRoute>
                  <ResultPoll/>
                </PrivateRoute>
              }/>

              <Route path='*' element={<h1 align='center'>Указанной страницы не существует</h1>}/>
            </Routes>
          </Layout>
    </div>
  );
}

export default App;
