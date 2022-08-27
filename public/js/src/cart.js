import axios from "axios";

import { Notyf } from 'notyf';

// Create an instance of Notyf
const notyf = new Notyf({
  position: {
      x: 'right',
      y: 'top',
  },
});

const initCart = () => {
  const addToCart = document.querySelectorAll("#add-to-cart");
  const cartCount = document.querySelector("#cart-count");

  const deleteFromCart = document.querySelectorAll("#delete-from-cart");

  const addProductToCart = async (product) => {
    try {
      const res = await axios.post("/add-to-cart", product);
      cartCount.innerHTML = res.data.totalQty;
      notyf.success('Product Added to cart!');
    } catch (error) {
      console.log(error);
      notyf.success('Something went wrong!');
    }
  };

  addToCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const product = JSON.parse(btn.dataset.product);
      addProductToCart(product);
    });
  });

  const deleteCartItem = async (product) => {
    try {
      const res = await axios.post("/delete-from-cart", product);
      notyf.error('Product Deleted from cart!');
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  deleteFromCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const product = JSON.parse(btn.dataset.product);
      deleteCartItem(product);
    });
  });
};

export default initCart;
