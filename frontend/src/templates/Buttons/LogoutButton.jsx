import React from "react";
import { Button } from 'reactstrap';
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

function LogoutButton() {

    let {logoutUser} = useContext(AuthContext);
    return(
        <Button className="buttons btn-lg" variant="Войти" onClick={logoutUser}>
          Выйти
        </Button>
    );
}

export default LogoutButton;