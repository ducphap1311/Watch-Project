import React, { useState } from "react";
import "../styles/Login.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup'

const Login = () => {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [errorLogin, setErrorLogin] = useState(false);
    const navigate = useNavigate();

    // const handleSubmit = async(e) => {
    //     e.preventDefault()
    //     if(!email || !password){
    //         setErrorLogin(true)
    //         return;
    //     }
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({email: email, password: password})
    //     }
    //     try {
    //         const response = await fetch('http://localhost:5000/api/v2/login', requestOptions)
    //         const responseData = await response.json()
    //         const {username, token} = responseData
    //         if(!username || !token){
    //             throw new Error('Invalid email or password')
    //         }
    //         localStorage.setItem('username', username)
    //         localStorage.setItem('token', token)
    //         navigate(-1)
    //     } catch (error) {
    //         setErrorLogin(true)
    //         console.log(error);
    //     }
    // }
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Email address required")
                .email("Invalid email address"),
            password: Yup.string()
                .required("Password required")
                .min(8, "Password must be at least 8 characters"),
        }),
        onSubmit: async (values) => {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            };
            try {
                const response = await fetch(
                    "http://localhost:5000/api/v2/login",
                    requestOptions
                );
                if (!response.ok) {
                    throw new Error("Invalid email or password");
                }
                const responseData = await response.json();
                const { username, token } = responseData;
                localStorage.setItem("username", username);
                localStorage.setItem("token", token);
                navigate("/");
            } catch (error) {
                setErrorLogin(true);
                // console.log(error);
            }
        },
    });
    return (
        <div className="login">
            <form onSubmit={formik.handleSubmit}>
                <h2 className="login-title">Login</h2>
                <p className="login-subtitle">
                    Please login using account detail bellow.
                </p>
                <div className="email-container">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                        className="email-input"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="email-error">{formik.errors.email}</p>
                    ) : null}
                </div>
                <div className="password-container">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        className="password-input"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="password-error">
                            {formik.errors.password}
                        </p>
                    ) : null}
                </div>
                {errorLogin && (
                    <p className="user-error">Email or password is incorrect</p>
                )}
                <button type="submit" className="sign-in-btn">
                    Sign in
                </button>
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
