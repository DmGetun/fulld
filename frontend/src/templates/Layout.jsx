import { Container } from "reactstrap";
import Footer from './Footer'
import './static/style.css'

function Layout(props) {

    return (
        <div>
            <Footer/>
            <Container>
                {props.children}
            </Container>
        </div>
    );
}

export default Layout;