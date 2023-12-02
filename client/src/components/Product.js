import React, { memo } from "react";
import "../styles/Product.scss";
import { Link } from "react-router-dom";
import { addItem } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Product = ({ product }) => {
    const dispatch = useDispatch();

    const addToCart = async (_id, amount, totalAmount) => {
        if (amount > totalAmount || totalAmount === 0) {
            toast("Not enough products to add", {
                type: "error",
                draggable: false,
            });
            return;
        }
        try {
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    totalAmount: totalAmount - 1,
                }),
            };
            const response = await fetch(
                `http://localhost:5000/api/v1/products/${_id}`,
                requestOptions
            );
            console.log(response);
            dispatch(addItem({ id: _id, amount }));
            toast("Add to cart successfully!", {
                type: "success",
                draggable: false,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div key={product._id} className="product-info">
            <Link to={`/products/${product._id}`}>
                <img
                    src={product.images[0]}
                    alt="product-img"
                    className="product-img"
                />
            </Link>
            <p className="product-name">{product.name}</p>
            <p className="product-price">
                <i className="fa-solid fa-dollar-sign"></i>
                {product.price}
            </p>
            <button
                className="add-btn"
                onClick={() => addToCart(product._id, 1, product.totalAmount)}
            >
                Add To Cart
            </button>
        </div>
    );
};

export default memo(Product);
