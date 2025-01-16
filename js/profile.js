const api_url = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api";
const token = "559d82a2-9ebd-4bc8-be4a-dfb248f34f04";
    async function fetchOrders() {
        try {
            const response = await fetch(`${api_url}/orders?api_key=${token}`);
            const orders = await response.json();
            const ordersTable = document.getElementById('orders-table');

            ordersTable.innerHTML = orders.map((order, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${order.created_at}</td>
                    <td>${order.good_ids.join(', ')}</td>
                    <td>${order.delivery_date}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="viewOrder(${order.id})" data-bs-toggle="modal" data-bs-target="#viewOrderModal">Просмотр</button>
                        <button class="btn btn-warning btn-sm" onclick="editOrder(${order.id})" data-bs-toggle="modal" data-bs-target="#editOrderModal">Редактирование</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id})" data-bs-toggle="modal" data-bs-target="#deleteOrderModal">Удаление</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }


    async function viewOrder(orderId) {
        try {
            const response = await fetch(`${api_url}/orders/${orderId}?api_key=${token}`);
            const order = await response.json();
            const viewOrderContent = document.getElementById('viewOrderContent');

            viewOrderContent.innerHTML = `
                <p><strong>Дата оформления:</strong> ${order.date}</p>
                <p><strong>Имя:</strong> ${order.full_name}</p>
                <p><strong>Номер телефона:</strong> ${order.phone}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
                <p><strong>Дата доставки:</strong> ${order.delivery_date}</p>
                <p><strong>Время доставки:</strong> ${order.delivery_time}</p>
                <p><strong>Состав заказа:</strong> ${order.items.join(', ')}</p>
                <p><strong>Комментарий:</strong> ${order.comment}</p>
            `;
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    }

    async function editOrder(orderId) {
        try {
            const response = await fetch(`${api_url}/orders/${orderId}?api_key=${token}`);
            const order = await response.json();

            document.getElementById('editName').value = order.full_name;
            document.getElementById('editPhone').value = order.phone;
            document.getElementById('editEmail').value = order.email;
            document.getElementById('editAddress').value = order.delivery_address;
            document.getElementById('editDeliveryDate').value = order.delivery_date;
            document.getElementById('editDeliveryTime').value = order.delivery_time;
            document.getElementById('editComment').value = order.comment;

            document.getElementById('saveEditOrder').onclick = async () => {
                const updatedOrder = {
                    name: document.getElementById('editName').value,
                    phone: document.getElementById('editPhone').value,
                    email: document.getElementById('editEmail').value,
                    address: document.getElementById('editAddress').value,
                    deliveryDate: document.getElementById('editDeliveryDate').value,
                    deliveryTime: document.getElementById('editDeliveryTime').value,
                    comment: document.getElementById('editComment').value,
                };

                try {
                    await fetch(`${api_url}/orders/${orderId}?api_key=${token}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedOrder),
                    });
                    fetchOrders();
                    alert('Заказ успешно обновлён!');
                } catch (error) {
                    console.error('Error updating order:', error);
                }
            };
        } catch (error) {
            console.error('Error fetching order for editing:', error);
        }
    }

    function deleteOrder(orderId) {
        document.getElementById('confirmDeleteOrder').onclick = async () => {
            try {
                await fetch(`${api_url}/orders/${orderId}?api_key=${apiKey}`, { method: 'DELETE' });
                fetchOrders();
                alert('Заказ успешно удалён!');
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        };
    }

    fetchOrders();