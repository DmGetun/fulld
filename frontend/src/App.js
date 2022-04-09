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
import QuestionTemplate from './templates/CreatePoll/QuestionTemplate';
import MainBody from './templates/Polls/MainBody'


function App() {
  return (
    <div>
          <Layout>
            <Routes>
              <Route path='/' element = {<Banner/>}/>
              <Route path='/opros' element={<MainBody><PollBody/></MainBody>}/>
              <Route path='*' element={<h1 align='center'>Пошел нахуй</h1>}/>
            </Routes>
          </Layout>
    </div>
  );
}

export default App;
