import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { changeMyPassword } from "@/lib/api/users";

const push = vi.fn();
const logout = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/store/AuthContext", () => ({ useAuth: () => ({ isAuthenticated: true, logout }) }));
vi.mock("@/lib/api/users", () => ({ changeMyPassword: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ChangePasswordForm", () => {
  it("ends the session after a password change, since the backend revokes older tokens", async () => {
    vi.mocked(changeMyPassword).mockResolvedValue(undefined);
    const { container } = render(<ChangePasswordForm />);

    const [current, next, confirm] = Array.from(container.querySelectorAll('input[type="password"]'));
    fireEvent.change(current, { target: { value: "Senha1234" } });
    fireEvent.change(next, { target: { value: "NovaSenha9" } });
    fireEvent.change(confirm, { target: { value: "NovaSenha9" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    expect(push).toHaveBeenCalledWith("/login?motivo=senha-alterada");
  });
});
