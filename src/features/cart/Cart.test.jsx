import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "./Cart";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import { clearCart } from "./cartSlice";

jest.mock("./CartItem", () => ({ item }) => <div>{item.name}</div>);
jest.mock("./cartSlice", () => ({
  ...jest.requireActual("./cartSlice"),
  clearCart: jest.fn(() => ({ type: "cart/clearCart" })),
  getCart: (state) => state.cart,
}));

const mockStore = configureStore([]);

describe("Cart Component", () => {
  it("renders EmptyCart when cart is empty", () => {
    const store = mockStore({
      cart: [],
      user: { username: "Amer" },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>,
    );

    expect(
      screen.getByText(/Your cart is still empty. Start adding some pizzas/i),
    ).toBeInTheDocument();
  });

  it("renders heading with username when cart has items", () => {
    const store = mockStore({
      cart: [{ pizzaId: 1, name: "Margherita" }],
      user: { username: "Amer" },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText(/your cart, Amer/i)).toBeInTheDocument();
    expect(screen.getByText(/Margherita/i)).toBeInTheDocument();
  });

  it("renders correct number of CartItem components", () => {
    const store = mockStore({
      cart: [
        { pizzaId: 1, name: "Margherita" },
        { pizzaId: 2, name: "Pepperoni" },
      ],
      user: { username: "Amer" },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText(/Margherita/)).toBeInTheDocument();
    expect(screen.getByText(/Pepperoni/)).toBeInTheDocument();
  });

  it("dispatches clearCart when Clear cart button is clicked", () => {
    const store = mockStore({
      cart: [{ pizzaId: 1, name: "Veggie" }],
      user: { username: "Amer" },
    });

    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>,
    );

    const clearButton = screen.getByRole("button", { name: /clear cart/i });
    fireEvent.click(clearButton);

    expect(store.dispatch).toHaveBeenCalledWith(clearCart());
  });

  it("renders Order pizzas button with correct link", () => {
    const store = mockStore({
      cart: [{ pizzaId: 1, name: "Margherita" }],
      user: { username: "Amer" },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>,
    );

    const orderLink = screen.getByRole("link", { name: /order pizzas/i });
    expect(orderLink).toHaveAttribute("href", "/order/new");
  });
});
