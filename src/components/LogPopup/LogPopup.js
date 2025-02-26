import './LogPopup.css';

import React from 'react'

const LogPopup = () => {
    return (
        <>
            <section className="login-popup">

                <div>
                    <h2>Kindly Login!!</h2>
                    <p>As we saw you not logged in, <br />Kindly click below to register or login</p>

                    <a href="https://ap-south-10b3kucba8.auth.ap-south-1.amazoncognito.com/login?client_id=67mhd8e5bgb4glr0rc7qs0o80b&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000">Login here!</a>
                </div>

            </section>
        </>
    )
}

export default LogPopup