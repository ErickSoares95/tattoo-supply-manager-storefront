import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import ErrorPage from "@/app/error";

const error = new Error("fetch failed");

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function advanceSeconds(seconds: number) {
  for (let i = 0; i < seconds; i++) {
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  }
}

describe("root error boundary", () => {
  it("retries on its own after the countdown", () => {
    const retry = vi.fn();
    render(<ErrorPage error={error} retry={retry} />);

    expect(screen.getByRole("status").textContent).toContain("15s");
    advanceSeconds(14);
    expect(retry).not.toHaveBeenCalled();

    advanceSeconds(1);
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("stops retrying on its own after four attempts", () => {
    const retry = vi.fn();
    render(<ErrorPage error={error} retry={retry} />);

    advanceSeconds(15 * 6);

    expect(retry).toHaveBeenCalledTimes(4);
    expect(screen.getByRole("status").textContent).toContain("Não conseguimos conectar");
  });

  it("retries right away from the button and restarts the automatic attempts", () => {
    const retry = vi.fn();
    render(<ErrorPage error={error} retry={retry} />);
    advanceSeconds(15 * 4);
    expect(retry).toHaveBeenCalledTimes(4);

    fireEvent.click(screen.getByRole("button", { name: "Tentar de novo" }));
    expect(retry).toHaveBeenCalledTimes(5);

    advanceSeconds(15);
    expect(retry).toHaveBeenCalledTimes(6);
  });
});
