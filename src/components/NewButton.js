import React from "react";


const NewButton = (props) => {

    return(
        <button {...props}>
            {props.children}
        </button>
    )
}

export default NewButton;