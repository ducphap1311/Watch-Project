import React, { memo } from "react";
import "../styles/Product.scss";
import { Link } from "react-router-dom";
import { addItem } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Product = ({ product }) => {
    const dispatch = useDispatch();

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
                onClick={() => {
                    dispatch(
                        addItem({ id: product._id, amount: product.amount, size: product.size })
                    );
                    toast("Add to cart successfully!", {
                        type: "success",
                        draggable: false
                    });
                }}
            >
                Add To Cart
            </button>
        </div>
    );
};

export default memo(Product);
