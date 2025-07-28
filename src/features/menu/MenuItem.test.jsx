import { render, screen, fireEvent } from "@testing-library/react";
import MenuItem from "./MenuItem";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import * as cartSlice from "../cart/cartSlice";
import React from "react";

const mockStore = configureStore([]);
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

describe("MenuItem", () => {
  const pizza = {
    id: 1,
    name: "Margherita",
    unitPrice: 10,
    ingredients: ["cheese", "tomato"],
    soldOut: false,
    imageUrl: "/pizza.jpg",
  };

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("renders pizza details correctly", () => {
    // Simulate not in cart
    require("react-redux").useSelector.mockReturnValue(0);

    const store = mockStore({});
    render(
      <Provider store={store}>
        <MenuItem pizza={pizza} />
      </Provider>,
    );

    expect(screen.getByText("Margherita")).toBeInTheDocument();
    expect(screen.getByText(/cheese, tomato/i)).toBeInTheDocument();
    expect(screen.getByText("€10.00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  it("does not show add/update/delete buttons when sold out", () => {
    const soldOutPizza = { ...pizza, soldOut: true };
    require("react-redux").useSelector.mockReturnValue(0);

    render(
      <Provider store={mockStore({})}>
        <MenuItem pizza={soldOutPizza} />
      </Provider>,
    );

    expect(screen.getByText(/sold out/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add to cart/i }),
    ).not.toBeInTheDocument();
  });

  it("shows UpdateItemQuantity and DeleteItem when pizza is in cart", () => {
    require("react-redux").useSelector.mockReturnValue(2); // means it's in cart

    render(
      <Provider store={mockStore({})}>
        <MenuItem pizza={pizza} />
      </Provider>,
    );

    expect(screen.getByText(/delete/i)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // from UpdateItemQuantity
  });

  it("dispatches addItem on Add to cart button click", () => {
    require("react-redux").useSelector.mockReturnValue(0); // not in cart

    render(
      <Provider store={mockStore({})}>
        <MenuItem pizza={pizza} />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(mockDispatch).toHaveBeenCalledWith(
      cartSlice.addItem({
        pizzaId: 1,
        name: "Margherita",
        quantity: 1,
        unitPrice: 10,
        totalPrice: 10,
      }),
    );
  });
});
