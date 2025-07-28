import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";
import { BrowserRouter } from "react-router-dom";

// Helper wrapper for rendering with routing context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Button component", () => {
  test("renders a Link when 'to' prop is provided", () => {
    renderWithRouter(
      <Button to="/home" type="primary">
        Go Home
      </Button>,
    );
    const link = screen.getByRole("link", { name: /go home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
  });

  test("renders a button when 'onClick' prop is provided", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} type="small">
        Click Me
      </Button>,
    );
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders a disabled button when 'disabled' is true", () => {
    render(
      <Button disabled={true} type="round">
        Disabled
      </Button>,
    );
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  test("renders correct styles for 'primary' type", () => {
    render(<Button type="primary">Primary</Button>);
    const button = screen.getByRole("button", { name: /primary/i });
    expect(button.className).toMatch(/bg-teal-400/);
  });

  test("renders correct styles for 'secondary' type", () => {
    render(<Button type="secondary">Secondary</Button>);
    const button = screen.getByRole("button", { name: /secondary/i });
    expect(button.className).toMatch(/border-stone-300/);
  });

  test("renders plain button when no 'to' or 'onClick' is provided", () => {
    render(<Button type="small">Plain</Button>);
    const button = screen.getByRole("button", { name: /plain/i });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });
});
