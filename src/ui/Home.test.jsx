import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";
import Home from "./Home";

// ✅ 1. Mock the components being used inside Home
jest.mock("../features/user/CreateUser", () => () => (
  <div data-testid="create-user">Mock CreateUser</div>
));

jest.mock("./Button", () => (props) => (
  <a data-testid="button" href={props.to}>
    {props.children}
  </a>
));

// ✅ 2. Set up mock store
const mockStore = configureStore([]);

describe("Home Component", () => {
  it("renders heading correctly", () => {
    const store = mockStore({ user: { username: "" } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText(/The best pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/Straight out of the oven/i)).toBeInTheDocument();
  });

  it("renders CreateUser when username is empty", () => {
    const store = mockStore({ user: { username: "" } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId("create-user")).toBeInTheDocument();
  });

  it("renders Button with username when username is present", () => {
    const store = mockStore({ user: { username: "Amer" } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/menu");
    expect(button).toHaveTextContent("Continue ordering, Amer");
  });
});
