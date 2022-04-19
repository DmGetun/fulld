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



function App() {
  return (
    <div className='body justify-content-center'>
          <Layout>
            <Routes>
              <Route path='/' element = {<Banner/>}/>
              <Route path='/opros/:poll' element={<PassBody/>}/>
              <Route path='/opros/' element={<PassBody/>}/>
              <Route path='/create' element={
                <PrivateRoute>
                  <CreatePollBody/>
                </PrivateRoute>
              }/>
              <Route path='/user/login' element={<AuthForm/>}/>
              <Route path='/registr' element = {<RegistrationForm/>}/>
              <Route path='*' element={<h1 align='center'>Пошел нахуй</h1>}/>
            </Routes>
          </Layout>
    </div>
  );
}

export default App;
