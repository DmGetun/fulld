import React from "react";
import { Button } from 'reactstrap';

function AuthButton() {

    return(
        <Button className="buttons btn-lg" variant="Войти" onClick={() => window.location.assign("http://localhost:3000/login")}>
          Войти
        </Button>

    );
}

export default AuthButton;