import React from "react";
import { Button } from 'reactstrap';

function RegButton() {


    return(
        <Button className='buttons btn-lg' variant="Войти" onClick={() => window.location.assign("http://localhost:3000/registr")}>
          Зарегистрироваться
        </Button>
    );
}

export default RegButton;