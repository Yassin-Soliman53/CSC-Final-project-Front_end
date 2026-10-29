export const GUEST_ORDERS_STORAGE_KEY = "delivery-guest-orders";

export function getGuestOrders() {
  const savedOrders = window.localStorage.getItem(GUEST_ORDERS_STORAGE_KEY);

  if (!savedOrders) {
    return [];
  }

  const orders = JSON.parse(savedOrders);

  if (!Array.isArray(orders)) {
    throw new Error("Saved guest orders must be an array.");
  }

  return orders;
}

export function saveGuestOrder(order) {
  const orders = getGuestOrders();
  const updatedOrders = [order, ...orders];

  window.localStorage.setItem(
    GUEST_ORDERS_STORAGE_KEY,
    JSON.stringify(updatedOrders),
  );
  window.dispatchEvent(new Event("guest-orders-updated"));

  return updatedOrders;
}
