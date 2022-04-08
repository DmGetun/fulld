import { Container } from "reactstrap";
import Footer from './Footer'

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