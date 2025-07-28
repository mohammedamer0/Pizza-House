import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { BrowserRouter } from "react-router-dom";

// Mocking child components
jest.mock("../features/order/SearchOrder", () => () => (
  <div>SearchOrderMock</div>
));
jest.mock("../features/user/Username", () => () => <div>UsernameMock</div>);

// Render with router context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Header component", () => {
  test("renders the Pizza House logo/link", () => {
    renderWithRouter(<Header />);
    const logoLink = screen.getByRole("link", { name: /pizza house/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  test("renders SearchOrder component", () => {
    renderWithRouter(<Header />);
    expect(screen.getByText("SearchOrderMock")).toBeInTheDocument();
  });

  test("renders Username component", () => {
    renderWithRouter(<Header />);
    expect(screen.getByText("UsernameMock")).toBeInTheDocument();
  });
});
