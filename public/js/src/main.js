import initCart from "./cart.js";
import initAdmin from "./admin.js";
import moment from "moment";

import { Notyf } from 'notyf';

// Create an instance of Notyf
const notyf = new Notyf({
  position: {
      x: 'right',
      y: 'top',
  },
});

const menuOpenBtn = document.querySelector("#nav-open-btn");
const menuCloseBtn = document.querySelector("#nav-close-btn");
const mobileNav = document.querySelector("#mobile-nav");

const navElems = [menuOpenBtn, menuCloseBtn];

for (let i = 0; i < navElems.length; i++) {
  navElems[i].addEventListener("click", function () {
    mobileNav.classList.toggle("invisible");
  });
}

// search toggle

const searchContainer = document.querySelector("#search-wrapper");
const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click", function () {
  searchContainer.classList.toggle("active");
});

//  Back to top btn
const backTopBtn = document.querySelector(".back-to-top");
window.addEventListener("scroll", function () {
  window.scrollY >= 100
    ? backTopBtn.classList.add("a-ctive")
    : backTopBtn.classList.remove("active");
});

initCart();

// Order Status Update
let statuses = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement("small");

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}

updateStatus(order);

//Socket
let socket = io();

// Join
if(order) {
  socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname;

if(adminAreaPath.includes('admin')) {
  initAdmin(socket);
  socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  notyf.success('Order Status Updated!');
})