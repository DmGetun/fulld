import { Container } from "reactstrap";
import Footer from './footer'

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