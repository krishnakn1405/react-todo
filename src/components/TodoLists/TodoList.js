import './TodoList.css';
import React from 'react'

const TodoList = (props) => {
    const { todo, deleteNote, editNote } = props;
    return (
        <>
            <div className="todo-list">
                <div className="todo-list-left">
                    <i className="fa fa-edit" onClick={() => editNote(todo)}></i>
                    <i className="fa fa-times" onClick={() => deleteNote(todo.id)}></i>
                </div>
                <div className="todo-list-right">
                    <p>{todo.name}</p>
                </div>
            </div>
        </>
    )
}

export default TodoList