// Order.test.jsx

import React from "react";
import { render, screen } from "@testing-library/react";
import Order from "./Order";
import { useFetcher, useLoaderData } from "react-router-dom";

// Mock child components
jest.mock("./OrderItem", () => () => <div>Mocked OrderItem</div>);
jest.mock("./UpdateOrder", () => () => <div>Mocked UpdateOrder</div>);

// Mock services and utils
jest.mock("../../services/apiRestaurant", () => ({
  getOrder: jest.fn(),
}));

jest.mock("../../utils/helpers", () => ({
  calcMinutesLeft: jest.fn(() => 20),
  formatCurrency: jest.fn((val) => `₹${val}`),
  formatDate: jest.fn(() => "28 July, 2025"),
}));

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useFetcher: jest.fn(),
  useLoaderData: jest.fn(),
}));

describe("Order Component", () => {
  beforeEach(() => {
    useLoaderData.mockReturnValue({
      id: 101,
      status: "Preparing",
      priority: true,
      priorityPrice: 80,
      orderPrice: 520,
      estimatedDelivery: new Date().toISOString(),
      cart: [{ pizzaId: 1, name: "Cheese Pizza", quantity: 2 }],
    });

    useFetcher.mockReturnValue({
      data: [{ id: 1, ingredients: ["cheese", "tomato"] }],
      state: "idle",
      load: jest.fn(),
    });
  });

  it("renders order ID and status correctly", () => {
    render(<Order />);
    expect(screen.getByText("Order #101 status")).toBeInTheDocument();
    expect(screen.getByText("Preparing order")).toBeInTheDocument();
  });

  it("displays estimated delivery message", () => {
    render(<Order />);
    expect(screen.getByText(/Only 20 minutes left/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Estimated delivery: 28 July, 2025/i),
    ).toBeInTheDocument();
  });

  it("renders formatted price and priority cost", () => {
    render(<Order />);
    expect(screen.getByText("Price pizza: ₹520")).toBeInTheDocument();
    expect(screen.getByText("Price priority: ₹80")).toBeInTheDocument();
    expect(screen.getByText("To pay on delivery: ₹600")).toBeInTheDocument();
  });

  it("renders OrderItem and UpdateOrder components", () => {
    render(<Order />);
    expect(screen.getByText("Mocked OrderItem")).toBeInTheDocument();
    expect(screen.queryByText("Mocked UpdateOrder")).not.toBeInTheDocument(); // because priority is true
  });

  it("should NOT render UpdateOrder when priority is true", () => {
    render(<Order />);
    expect(screen.queryByText("Mocked UpdateOrder")).not.toBeInTheDocument();
  });

  it("should render UpdateOrder when priority is false", () => {
    useLoaderData.mockReturnValue({
      id: 101,
      status: "Preparing",
      priority: false,
      priorityPrice: 0,
      orderPrice: 400,
      estimatedDelivery: new Date().toISOString(),
      cart: [{ pizzaId: 2, name: "Veggie", quantity: 1 }],
    });

    render(<Order />);
    expect(screen.getByText("Mocked UpdateOrder")).toBeInTheDocument();
  });
});
