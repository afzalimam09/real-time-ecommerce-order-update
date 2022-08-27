import axios from "axios";
import moment from "moment";
import { Notyf } from 'notyf';

// Create an instance of Notyf
const notyf = new Notyf();

const initAdmin = async (socket) => {
    const orderTableBody = document.querySelector('#orderTableBody');
    let orders = [];
    let markup;


    const renderItems = (items) => {
        let parsedItems = Object.values(items)
        return parsedItems.map((product) => {
            return `
                <p>${ product.item.title } - Qty: ${ product.qty } </p>
            `
        }).join('');
    }

    const generateMarkup = (orders) => {
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2">${ order.customerId.name }</td>
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="admin-order block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="shipped" ${ order.status === 'shipped' ? 'selected' : '' }>
                                    Shipped</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-4 py-2">
                    ${ order.paymentStatus ? 'Paid' : 'Not paid' }
                </td>
            </tr>
        `
        }).join('');
    }

    socket.on('orderPlaced', (order) => {
        notyf.success('Order Updated!');
        orders.unshift(order);
        orderTableBody.innerHTML = '';
        orderTableBody.innerHTML = generateMarkup(orders);
    });

    try {
        const res = await axios.get('/admin/orders', {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        });

        orders = res.data;
        markup = generateMarkup(orders);
        orderTableBody.innerHTML = markup;

    } catch (error) {
        console.log(error)
    }
}

export default initAdmin;