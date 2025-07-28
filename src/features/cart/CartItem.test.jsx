import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import React from "react";
import CartItem from "./CartItem";
import configureStore from "redux-mock-store";
import * as cartSlice from "./cartSlice";

// Mocks
jest.mock("./UpdateItemQuantity", () => () => (
  <div data-testid="update-item" />
));
jest.mock("./DeleteItem", () => () => <div data-testid="delete-item" />);

const mockStore = configureStore([]);

describe("CartItem", () => {
  const item = {
    pizzaId: 1,
    name: "Pepperoni",
    quantity: 2,
    totalPrice: 500,
  };

  let store;

  beforeEach(() => {
    // Mock selector return
    jest.spyOn(cartSlice, "getCurrentQuantityById").mockReturnValue(() => 2);

    store = mockStore({
      cart: {
        cartItems: [{ ...item }],
      },
    });

    render(
      <Provider store={store}>
        <CartItem item={item} />
      </Provider>,
    );
  });

  it("renders item name and quantity", () => {
    expect(screen.getByText(/2× Pepperoni/i)).toBeInTheDocument();
  });

  it("displays the total price", () => {
    expect(screen.getByText("€500.00")).toBeInTheDocument(); // Assuming formatCurrency gives ₹500.00
  });

  it("renders UpdateItemQuantity component", () => {
    expect(screen.getByTestId("update-item")).toBeInTheDocument();
  });

  it("renders DeleteItem component", () => {
    expect(screen.getByTestId("delete-item")).toBeInTheDocument();
  });

  it("calls getCurrentQuantityById with correct pizzaId", () => {
    expect(cartSlice.getCurrentQuantityById).toHaveBeenCalledWith(1);
  });
});
