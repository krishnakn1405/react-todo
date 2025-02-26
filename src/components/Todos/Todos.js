import NoTodos from '../NoTodos/NoTodos';
import TodoList from '../TodoLists/TodoList';
import './Todos.css';

import React, { useEffect, useState } from 'react'

const Todos = () => {

    const host = "https://amazonaws.com/Dev/todos";
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState({ name: "" });

    useEffect(() => {
        fetchNotes();
    }, [])

    // Fetch Notes
    const fetchNotes = async () => {

        try {

            // API Call
            const response = await fetch(`${host}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("todo-auth-token")
                },
                mode: "cors"
            });

            const res = await response.json();

            if (res.message === 'The incoming token has expired') {
                localStorage.removeItem("todo-auth-token");
                window.location.href = "/";
            } else if (res.Operation === 'GET' && res.Message === 'SUCCESS') {
                const notes = res.Item;
                notes.sort((a, b) => Number(b.date_time) - Number(a.date_time));
                setTodos(notes);
            } else if (res.Operation === 'NONE' && res.Message === 'FAILURE') {
                console.log(res.Item);
            }

        } catch (error) {
            console.log("Error: " + error);

        }

    }

    // Add Notes
    const addNotes = async (name) => {

        try {

            // API Call
            const response = await fetch(`${host}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("todo-auth-token")
                },
                body: JSON.stringify({ name }),
                mode: "cors"
            });

            const res = await response.json();

            if (res.message === 'Unauthorized') {
                localStorage.removeItem("todo-auth-token");
                window.location.href = "/";
            } else if (res.Operation === 'POST' && res.Message === 'SUCCESS') {
                setTodos([res.Item].concat(todos));
            } else if (res.Operation === 'NONE' && res.Message === 'FAILURE') {
                console.log(res.Item);
            }

        } catch (error) {
            console.log("Error: " + error);

        }
    }

    // Update Notes
    const updateNotes = async (todo) => {

        try {

            // API Call
            const response = await fetch(`${host}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("todo-auth-token")
                },
                body: JSON.stringify(todo),
                mode: "cors"
            });

            const res = await response.json();       

            if (res.message === 'Unauthorized') {
                localStorage.removeItem("todo-auth-token");
                window.location.href = "/";
            } else if (res.Operation === 'PUT' && res.Message === 'SUCCESS') {
                const updateArray = todos.map(todo1 => todo1.id === todo.id ? { ...todo1, name: todo.name, date_time: res.Item } : todo1)
                updateArray.sort((a, b) => Number(b.date_time) - Number(a.date_time));
                setTodos(updateArray);

            } else if (res.Operation === 'NONE' && res.Message === 'FAILURE') {
                console.log(res.Item);
            }

        } catch (error) {
            console.log("Error: " + error);
        }

    }

    // Delete Note
    const deleteNote = async (id) => {

        try {

            // API Call
            const response = await fetch(`${host}?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("todo-auth-token")
                },
                mode: "cors"
            });

            const res = await response.json();

            if (res.message === 'Unauthorized') {
                localStorage.removeItem("todo-auth-token");
                window.location.href = "/";
            } else if (res.Operation === 'DELETE' && res.Message === 'SUCCESS') {
                const newTodos = todos.filter((todo) => { return todo.id !== id });
                setTodos(newTodos);
            } else if (res.Operation === 'NONE' && res.Message === 'FAILURE') {
                console.log(res.Item);
            }

        } catch (error) {
            console.log("Error: " + error);
        }

    }

    // Edit Note
    const editNote = (todo) => {
        let newValue = prompt("Enter edit todo: ", todo.name);
        todo.name = newValue;
        updateNotes(todo);
    }

    const handleClick = (e) => {
        e.preventDefault();
        if (todo.todo.length >= 5) {
            addNotes(todo.todo);
            document.getElementById('todoValue').value = '';
            setTodo({ name: "" });
        }
    }

    const onChange = (e) => {
        setTodo({ ...todo, [e.target.name]: e.target.value });
    }

    return (
        <>
            <section className="todo-section">

                <div className="todo-section-left">
                    <h2>Add todo</h2>
                    <textarea onChange={onChange} name="todo" id="todoValue" minLength={5}></textarea>
                    <button className="btn" onClick={handleClick} id='addBtn'>Add todo</button>
                </div>

                <div className="todo-section-right" id="todoRight">

                    {todos.length === 0 && <NoTodos name="No Todos" />}

                    {
                        todos.length !== 0 && todos.map((todo) => {
                            return <TodoList key={todo.id} todo={todo} deleteNote={deleteNote} editNote={editNote} />;
                        })
                    }

                </div>
            </section>
        </>
    )
}

export default Todos