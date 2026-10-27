import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import RestaurantMenu from "..//components/RestaurantOrderPage/RestaurantMenu";
import OrderSummary from "../components/RestaurantOrderPage/OrderSummary";
import { FOUR_RESTAURANTS_CONFIG } from "../components/main-page/constants/restaurantsConfig.js";

const mockOrder = {
  _id: "671a2b3c4d5e6f7890123456",
  restaurant: {
    name: "شكشك",
    key: "shakshak",
    address: "6th of October City, Giza, Egypt",
    deliveryFees: 30,
  },
  collector: {
    id: "671a2b3c4d5e6f7890123457",
    name: "Ahmed Mohamed",
    roomNumber: 204,
    phone: "01012345678",
    note: "Please call me when the order arrives.",
  },
  settings: {
    closingPolicy: "manual",
    deadline: null,
    targetDeliveryAmount: null,
  },
  status: "open",
  createdAt: "2026-10-27T10:00:00.000Z",
  updatedAt: "2026-10-27T10:00:00.000Z",
};

export default function RestaurantOrderPage() {
  const { id } = useParams();

  const [cart, setCart] = useState([]);

  // TODO: Fetch the order using id from the backend.
  const order = mockOrder;

  const restaurantKey = order.restaurant?.key;
  const restaurantConfig = FOUR_RESTAURANTS_CONFIG[restaurantKey];

  const hasInteractiveMenu = Boolean(restaurantConfig?.categories?.length);

  const menuImage =
    restaurantConfig?.defaultMenuImage ||
    order.restaurant?.menuImage ||
    order.restaurant?.menuImageUrl ||
    "";

  const deliveryFees = Math.max(
    0,
    Number(order.restaurant?.deliveryFees ?? 30) || 0,
  );

  const addToCart = (selectedItems) => {
    setCart((currentCart) => {
      const updatedCart = [...currentCart];

      selectedItems.forEach((selectedItem) => {
        const cartItemId = `${selectedItem.id}-${selectedItem.sizeCode || "default"}`;

        const existingIndex = updatedCart.findIndex(
          (item) => item.cartItemId === cartItemId,
        );

        if (existingIndex !== -1) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity:
              updatedCart[existingIndex].quantity + selectedItem.quantity,
          };
        } else {
          updatedCart.push({
            id: selectedItem.id,
            name: selectedItem.name,
            cartItemId,
            sizeCode: selectedItem.sizeCode || null,
            sizeName: selectedItem.sizeName || null,
            price: selectedItem.price,
            quantity: selectedItem.quantity,
          });
        }
      });

      return updatedCart;
    });
  };

  const updateQuantity = (cartItemId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.cartItemId === cartItemId
            ? {
                ...item,
                quantity: item.quantity + change,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.cartItemId !== cartItemId),
    );
  };

  const itemsTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const total = itemsTotal + deliveryFees;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0">
            {hasInteractiveMenu ? (
              <RestaurantMenu
                categories={restaurantConfig.categories}
                sizeLabels={restaurantConfig.sizeLabels}
                onAddToCart={addToCart}
              />
            ) : menuImage ? (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                  <h2 className="text-xl font-bold text-gray-900">
                    منيو {order.restaurant?.name || "المطعم"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    تصفح صورة المنيو للاطلاع على الأصناف والأسعار.
                  </p>
                </div>

                <a
                  href={menuImage}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-gray-100"
                  aria-label="فتح صورة المنيو بالحجم الكامل"
                >
                  <img
                    src={menuImage}
                    alt={`منيو ${order.restaurant?.name || "المطعم"}`}
                    className="mx-auto h-auto max-h-[1000px] w-full object-contain"
                    loading="lazy"
                  />
                </a>
              </section>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  لا توجد صورة للمنيو
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  لم يتم توفير منيو تفاعلية أو صورة لهذا المطعم.
                </p>
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-6">
            <OrderSummary
              cart={cart}
              itemsTotal={itemsTotal}
              deliveryFees={deliveryFees}
              total={total}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          </aside>
        </div>

        {/* TODO: Connect order submission to the backend. */}
      </div>
    </main>
  );
}
