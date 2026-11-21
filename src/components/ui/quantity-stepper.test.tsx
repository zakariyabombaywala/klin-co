import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuantityStepper, clampQuantity } from "./quantity-stepper";

function Controlled({ max = 5, onChange }: { max?: number; onChange?: (v: number) => void }) {
  const [value, setValue] = useState(1);
  return (
    <QuantityStepper
      value={value}
      max={max}
      label="Quantity"
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
    />
  );
}

describe("clampQuantity", () => {
  it("keeps values inside the range", () => {
    expect(clampQuantity(0, 1, 5)).toBe(1);
    expect(clampQuantity(9, 1, 5)).toBe(5);
    expect(clampQuantity(3.6, 1, 5)).toBe(4);
    expect(clampQuantity(Number.NaN, 1, 5)).toBe(1);
  });

  it("never returns less than min even if stock is lower", () => {
    expect(clampQuantity(3, 1, 0)).toBe(1);
  });
});

describe("QuantityStepper", () => {
  it("increments and decrements with the buttons", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const input = screen.getByLabelText("Quantity");
    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(input).toHaveValue(3);
    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(input).toHaveValue(2);
  });

  it("disables decrease at the minimum and increase at the maximum", async () => {
    const user = userEvent.setup();
    render(<Controlled max={2} />);
    expect(screen.getByRole("button", { name: "Decrease quantity" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(screen.getByRole("button", { name: "Increase quantity" })).toBeDisabled();
  });

  it("clamps typed values to stock on blur", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled max={4} onChange={onChange} />);
    const input = screen.getByLabelText("Quantity");
    await user.clear(input);
    await user.type(input, "40");
    await user.tab();
    expect(input).toHaveValue(4);
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it("commits on Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    const input = screen.getByLabelText("Quantity");
    await user.clear(input);
    await user.type(input, "3{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(3);
  });
});
