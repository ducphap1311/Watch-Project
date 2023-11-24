import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "./Loading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SingleProduct.scss";
import { addItem } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const SingleProduct = () => {
    const { id } = useParams();
    const [singleProduct, setSingleProduct] = useState();
    const [amount, setAmount] = useState(1);
    const dispatch = useDispatch();
    
    const getSingleProduct = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/products/${id}`
            );
            const responseData = await response.json();
            const data = responseData.product;
            setSingleProduct(data);
        } catch (error) {
            console.log(error);
        }
    };

    let settings = {
        customPaging: function (i) {
            return (
                <img
                    src={singleProduct.images[i]}
                    alt="page-img"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            );
        },
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
    };

    const increaseAmount = () => {
        setAmount(amount + 1);
    };

    const decreaseAmount = () => {
        setAmount((prevAmount) => {
            if (prevAmount === 1) {
                return prevAmount;
            }
            return prevAmount - 1;
        });
    };

    useEffect(() => {
        getSingleProduct();
    }, [id]);

    if (!singleProduct) {
        return <Loading />;
    } else {
        const { _id, images, name, price, description } = singleProduct;
        return (
            <div className="single-product">
                <div className="single-product-container">
                    <Slider {...settings}>
                        {images.map((image, index) => {
                            return (
                                <div
                                    className="product-img-container"
                                    key={index}
                                >
                                    <img
                                        src={image}
                                        alt="product-img"
                                        className="product-img"
                                    />
                                </div>
                            );
                        })}
                    </Slider>
                    <div className="product-info-container">
                        <p className="product-name">{name}</p>
                        <p className="product-price">
                            <i className="fa-solid fa-dollar-sign"></i>
                            {price}
                        </p>
                        <p className="product-description">{description}</p>
                        <div className="product-quantity">
                            <button onClick={decreaseAmount}>
                                <i className="fa-solid fa-minus"></i>
                            </button>
                            <p className="amount">{amount}</p>
                            <button onClick={increaseAmount}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <button
                            className="add-btn"
                            onClick={() => {
                                dispatch(addItem({ id: _id, amount }));
                                toast("Add to cart successfully!", {
                                    type: "success",
                                    draggable: false,
                                });
                            }}
                        >
                            Add to cart
                        </button>
                        <Link to='/cart' className="buy-btn-container">
                            <button
                                className="buy-btn"
                                onClick={() => {
                                    dispatch(addItem({ id: _id, amount }));
                                    toast("Add to cart successfully!", {
                                        type: "success",
                                        draggable: false,
                                    });
                                }}
                            >
                                Buy now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
};
