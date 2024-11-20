import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { updateUserInfo } from "@/app/actions/actions";
import toast from "react-hot-toast";
import { User } from "@prisma/client";
import { ProfileForm } from "./profile-form";

// Мокируем функции, которые будем использовать в тесте
jest.mock("@/app/actions/actions");
jest.mock("react-hot-toast");

const mockUser: User = {
  id: 1,
  email: "test@example.com",
  fullName: "Test User",
  password: "",
  role: "USER",
  provider: null,
  providerId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  cartId: null,
  verified: null,
};

describe("ProfileForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("должен успешно обновлять данные пользователя", async () => {
    (updateUserInfo as jest.Mock).mockResolvedValueOnce({});

    render(<ProfileForm data={mockUser} />);

    // Находим поля ввода и кнопку
    const emailInput = screen.getByLabelText(/e-mail/i);
    const fullNameInput = screen.getByLabelText(/полное имя/i);
    const passwordInput = screen.getByLabelText(/новый пароль/i);
    const confirmPasswordInput = screen.getByLabelText(/повторите пароль/i);
    const submitButton = screen.getByRole("button", { name: /сохранить/i });

    // Вводим данные в поля
    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });
    fireEvent.change(fullNameInput, { target: { value: "New User" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword" },
    });

    // Отправляем форму
    fireEvent.click(submitButton);

    // Проверяем, что функция обновления была вызвана
    await waitFor(() => {
      expect(updateUserInfo).toHaveBeenCalledWith({
        email: "newemail@example.com",
        fullName: "New User",
        password: "newpassword",
      });
    });

    // Проверяем, что показано уведомление об успешном обновлении
    expect(toast.error).toHaveBeenCalledWith("Данные обновлены 📝", {
      icon: "✅",
    });
  });

  it("должен показывать ошибку при неудачном обновлении", async () => {
    (updateUserInfo as jest.Mock).mockRejectedValueOnce(new Error("Ошибка"));

    render(<ProfileForm data={mockUser} />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const fullNameInput = screen.getByLabelText(/полное имя/i);
    const passwordInput = screen.getByLabelText(/новый пароль/i);
    const confirmPasswordInput = screen.getByLabelText(/повторите пароль/i);
    const submitButton = screen.getByRole("button", { name: /сохранить/i });

    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });
    fireEvent.change(fullNameInput, { target: { value: "New User" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Ошибка при обновлении данных", {
        icon: "❌",
      });
    });
  });
});
