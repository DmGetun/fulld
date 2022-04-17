import React, { Fragment } from "react";


function Answers(props) {

    return (
        <div>
            {
                props.children.map((child,i) =>
                        (<Fragment key ={i}>{child}</Fragment>))
            }
        </div>
    );
}

export default Answers;