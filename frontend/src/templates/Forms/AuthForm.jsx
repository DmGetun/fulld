import React, { useState } from 'react';

function AuthForm(){
    

    
    return(
        <form>
            <label>
                Имя:
                <input type="text" name="name" />
            </label>
            <input type="submit" value="Отправить" />
        </form>
    );
}

export default AuthForm;