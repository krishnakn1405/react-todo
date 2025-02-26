import './NavBar.css';

import React, { useEffect } from 'react'

const NavBar = () => {

    useEffect(() => {
        // document.getElementById('mobileSearch').style.display = 'none';
        document.getElementById('navMenu').style.display = 'none';
    }, [])


    const navMenuFunction = () => {
        let navMenu = document.getElementById('navMenu');

        if (navMenu.style.display === "none") {
            navMenu.style.display = "block";
        } else {
            navMenu.style.display = "none";
        }
    }

    // const mobileSearchFunction = () => {
    //     let mobileSearch = document.getElementById('mobileSearch');

    //     if (mobileSearch.style.display === "none") {
    //         mobileSearch.style.display = "flex";
    //     } else {
    //         mobileSearch.style.display = "none";
    //     }
    // }

    const Logout = () => {
        localStorage.removeItem('todo-auth-token');
        window.location.href = "/";
    }

    return (
        <>
            <section className="navbar">

                <div className="navbar-left">
                    <h1>To-Do App</h1>
                </div>
                <div className="navbar-center">
                    {/* <div>
                        <input type="text" name="search" placeholder="Search todos" />
                        <button className="btn"><i className="fa fa-search"></i></button>
                    </div> */}
                </div>
                <div className="navbar-right">
                    {/* <i className="fa fa-search" onClick={mobileSearchFunction}></i> */}
                    <i className="fa fa-bars" onClick={navMenuFunction}></i>
                </div>

            </section>

            {/* <section className="search" id="mobileSearch">
                <input type="text" name="search" placeholder="Search todos" />
                <button className="btn"><i className="fa fa-search"></i></button>
            </section> */}

            <section className="nav-menu" id="navMenu">
                <ul>
                    <li onClick={ Logout }>Logout</li>
                </ul>
            </section>
        </>
    )
}

export default NavBar