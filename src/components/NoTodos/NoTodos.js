import './NoTodos.css';
import React from 'react'

const NoTodos = (props) => {
    return (
        <>
            <div className="loader">
                <p>{props.name}</p>
            </div>
        </>
    )
}

export default NoTodos