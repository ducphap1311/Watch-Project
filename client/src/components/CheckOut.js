import React, { useState, useEffect } from "react";
import "../styles/CheckOut.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import { Loading } from "./Loading";

export const CheckOut = () => {
    const { total, cartItems, amount } = useSelector((store) => store.cart);
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [citiesList, setCitiesList] = useState([]);
    const [district, setDistrict] = useState("");
    const [districtsList, setDistrictsList] = useState([]);
    const [ward, setWard] = useState("");
    const [wardsList, setwardsList] = useState([]);
    const [address, setAddress] = useState("");
    const [errorInput, setErrorInput] = useState(false);
    const [errorUser, setErrorUser] = useState(false);
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(true);
    const shippingPrice = 5;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        authenticateUser();
        if (!errorUser) getAddressInformations();
    }, []);

    const authenticateUser = async () => {
        setIsLoading(true);
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const response = await fetch(
                "http://localhost:5000/api/v2/dashboard",
                requestOptions
            );
            const responseData = await response.json();
            const success = responseData.msg;
            if (success !== "success") {
                throw new Error("Invalid user");
            }
            setErrorUser(false);
            setIsLoading(false);
        } catch (error) {
            setErrorUser(true);
            setIsLoading(false);
        }
    };

    const getAddressInformations = async () => {
        try {
            const response = await fetch(
                "https://provinces.open-api.vn/api/?depth=3"
            );
            const responseData = await response.json();
            setCitiesList(responseData);
        } catch (error) {
            console.log(error);
        }
    };

    const chooseCity = (e) => {
        setCity(e.target.value);
        const districts = citiesList.filter(
            (add) => add.name === e.target.value
        );
        setDistrictsList(districts[0].districts);
    };

    const chooseDistrict = (e) => {
        setDistrict(e.target.value);
        const wards = districtsList.filter(
            (dis) => dis.name === e.target.value
        );
        setwardsList(wards[0].wards);
    };

    const chooseWard = (e) => {
        setWard(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            name === "" ||
            address === "" ||
            city === "" ||
            district === "" ||
            ward === ""
        ) {
            setErrorInput(true);
            return;
        }
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                address: `${address}, ${ward}, ${district}, ${city}`,
                orderTotal: total + shippingPrice,
                cartItems: cartItems,
                amount: amount,
            }),
        };
        try {
            const response = await fetch(
                "http://localhost:5000/api/v3/orders",
                requestOptions
            );
            localStorage.removeItem("cartItems");
            dispatch(clearCart());
            if (!response) {
                throw new Error("something wrong here!");
            }
            navigate("/orders");
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!token || errorUser) {
        return (
            <div className="login-to-continue">
                <p>Please login to continue</p>
                <Link to="/login" className="login-link">
                    Login here
                </Link>
            </div>
        );
    } else if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <Link to="/products" className="fill-link">
                    Fill it
                </Link>
            </div>
        );
    }
    return (
        <div className="checkout">
            <div className="checkout-title">
                <h2>Place Your Order</h2>
            </div>
            <div className="checkout-information-container">
                <div className="checkout-information">
                    <p>Shipping Information</p>
                    <form onSubmit={handleSubmit}>
                        <div className="name-information">
                            <label>Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="city-information">
                            <label>City</label>
                            <select value={city} onChange={chooseCity}>
                                <option value="">Choose city</option>
                                {citiesList.map((city, index) => {
                                    return (
                                        <option key={index} value={city.name}>
                                            {city.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="district-information">
                            <label>District</label>
                            <select value={district} onChange={chooseDistrict}>
                                <option value="">Choose district</option>
                                {districtsList.map((district, index) => {
                                    return (
                                        <option
                                            value={district.name}
                                            key={index}
                                        >
                                            {district.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="ward-information">
                            <label>Ward</label>
                            <select value={ward} onChange={chooseWard}>
                                <option value="">Choose ward</option>
                                {wardsList.map((ward, index) => {
                                    return (
                                        <option value={ward.name} key={index}>
                                            {ward.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="address-information">
                            <label>Address Detail</label>
                            <input
                                type="text"
                                name="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        {errorInput && (
                            <p
                                style={{
                                    color: "red",
                                    fontSize: "14px",
                                    marginBottom: "20px",
                                }}
                            >
                                Please provide valid information
                            </p>
                        )}
                        <button type="submit">place your order</button>
                    </form>
                </div>
                <div className="price-information">
                    <div className="subtotal">
                        <p>Subtotal</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                    <div className="shipping">
                        <p>Shipping</p>
                        <p>${shippingPrice.toFixed(2)}</p>
                    </div>
                    <div className="order-total">
                        <p>Order Total</p>
                        <p>${(total + shippingPrice).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
