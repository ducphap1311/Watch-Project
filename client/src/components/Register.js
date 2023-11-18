import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.scss";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorRegister, setErrorRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userName || !password || !email) {
            setErrorRegister(true);
            return;
        }
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: userName,
                email: email,
                password: password,
            }),
        };

        try {
            const response = await fetch(
                "http://localhost:5000/api/v2/register",
                requestOptions
            );
            console.log(response);
            const responseData = await response.json();
            const { token, username } = responseData;
            if (!username || !token) {
                throw new Error("Invalid email or password");
            }
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            navigate("/");
        } catch (error) {
            setErrorRegister(true);
            console.log(error);
        }
    };
    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
                <h2 className="register-title">Register</h2>
                <p>Please register using account detail bellow.</p>
                <input
                    type="text"
                    placeholder="User Name"
                    className="username-input"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <input
                    type="email"
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
                {errorRegister && (
                    <p style={{ color: "red" }}>Invalid Informations</p>
                )}
                <button type="submit" className="register-btn">
                    Register
                </button>
                <p>
                    Already have an Account?
                    <Link to="/login" className="link-to-login">
                        Login now
                    </Link>
                </p>
            </form>
        </div>
    );
};
