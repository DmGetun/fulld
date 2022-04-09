import { Route } from "react-router";
import { Container } from "reactstrap";



function MainBody(props) {

  const n = 8;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  let questions = items.questions;
  let card_ = questions.map((item,i) => <QuestionCard key={i} title={item.title} answers={item.answers}/> );

  // Примечание: пустой массив зависимостей [] означает, что
  // этот useEffect будет запущен один раз
  // аналогично componentDidMount()
  useEffect(() => {
    fetch("http://127.0.0.1:8000/get_opros")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
          localStorage.setItem('poll',result.questions)
        },
        // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
        // чтобы не перехватывать исключения из ошибок в самих компонентах.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  return (
    <div class="container">
      <div class="row">
        <div class="col">
            asd
        </div>
        <div class="col-6">
            <Container>
                {props.children }
            </Container>
        </div>
        <div class="col">
        </div>
      </div>
    </div>
  );
}


export default MainBody;
