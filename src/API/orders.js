import apiRequest from "./apirequest.js";

const getMyOrders = () => apiRequest("/orders/my-orders");

const getOrder = (orderId) =>
  apiRequest(`/orders/${encodeURIComponent(orderId)}`);

const joinOrder = (orderId, data) =>
  apiRequest(`/orders/${encodeURIComponent(orderId)}/join`, {
    method: "POST",
    body: JSON.stringify(data),
  });

const updateMyOrder = (orderId, data) =>
  apiRequest(`/orders/${encodeURIComponent(orderId)}/my-order`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

const cancelMyOrder = (orderId) =>
  apiRequest(`/orders/${encodeURIComponent(orderId)}/my-order`, {
    method: "DELETE",
  });

export { getMyOrders, getOrder, joinOrder, updateMyOrder, cancelMyOrder };
