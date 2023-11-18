import React, { useState } from "react";
import "../styles/Login.scss";
import { Link } from "react-router-dom";
import { useNavigate} from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorLogin, setErrorLogin] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!email || !password){
            setErrorLogin(true)
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email, password: password})
        }
        try {
            const response = await fetch('http://localhost:5000/api/v2/login', requestOptions)
            const responseData = await response.json()
            const {username, token} = responseData
            if(!username || !token){
                throw new Error('Invalid email or password')
            }
            localStorage.setItem('username', username)
            localStorage.setItem('token', token)
            navigate(-1)
        } catch (error) {
            setErrorLogin(true)
            console.log(error);
        }
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>
                <p>Please login using account detail bellow.</p>
                <input
                    type="text"
                    placeholder="Email Address"
                    className="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errorLogin && <p style={{color: 'red'}}>Invalid Informations</p>}
                <button className="sign-in-btn">Sign in</button>
                <p>
                    Don't have an Account?
                    <Link to="/register" className="link-to-register">
                        Create account
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
