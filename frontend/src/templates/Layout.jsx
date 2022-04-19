import { Container } from "reactstrap";
import Footer from './Footer'
import AuthForm from "./Forms/AuthForm";
import { useState } from "react";

function Layout(props) {

    const [isActive, setActive] = useState(false);

    return (
        <div>
            <Footer/>
            <Container>
                {props.children}
            </Container>
            <AuthForm active={isActive} setActive={setActive}/>
        </div>
    );
}

export default Layout;