import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import DeleteItem from "./DeleteItem";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import * as cartSlice from "./cartSlice";

const mockStore = configureStore([]);
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

describe("DeleteItem", () => {
  const pizzaId = 42;

  beforeEach(() => {
    mockDispatch.mockClear();

    render(
      <Provider store={mockStore({})}>
        <DeleteItem pizzaId={pizzaId} />
      </Provider>,
    );
  });

  it("renders the Delete button", () => {
    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toBeInTheDocument();
  });

  it("dispatches deleteItem action on click", () => {
    const button = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith(cartSlice.deleteItem(pizzaId));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
