import { describe, it, expect, jest } from "@jest/globals";
import { prisma } from "../../../prisma/prisma-client";
import { createOrder, registerUser, updateUserInfo } from "./actions";
import { cookies } from "next/headers";
import { createPayment } from "@/shared/lib/creat-payment";
import { sendEmail } from "@/shared/lib/send-email";
import { getUserSession } from "@/shared/lib/get-user-session";

jest.mock("../../../prisma/prisma-client", () => ({
  prisma: {
    cart: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
      update: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    verificationCode: {
      create: jest.fn(),
    },
  },
}));
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({ get: jest.fn() }),
}));
jest.mock("@/shared/lib/creat-payment", () => ({
  createPayment: jest.fn(),
}));
jest.mock("@/shared/lib/send-email", () => ({
  sendEmail: jest.fn(),
}));
jest.mock("@/shared/lib/get-user-session", () => ({
  getUserSession: jest.fn(),
}));
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedCookies = jest.mocked(cookies);
const mockedCreatePayment = jest.mocked(createPayment);
const mockedSendEmail = jest.mocked(sendEmail);
const mockedGetServerSession = jest.mocked(getUserSession);
describe("createOrder", () => {
  const mockCart = {
    id: 1,
    userId: 1,
    totalAmount: 0,
    token: "111111",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFormData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "123456789",
    address: "123 Main St",
    comment: "Leave at the door",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if cart token is not found", async () => {
    (mockedCookies().get as jest.Mock).mockReturnValue({ value: null });

    await expect(createOrder(mockFormData)).rejects.toThrow(
      "Cart token not found",
    );
  });

  it("should throw an error if cart is not found", async () => {
    (mockedCookies().get as jest.Mock).mockReturnValue({ value: "cartToken" });
    mockedPrisma.cart.findFirst.mockResolvedValue(null);

    await expect(createOrder(mockFormData)).rejects.toThrow("Cart not found");
  });

  it("should throw an error if cart is empty", async () => {
    (mockedCookies().get as jest.Mock).mockReturnValue({ value: "cartToken" });
    mockedPrisma.cart.findFirst.mockResolvedValue({
      ...mockCart,
      totalAmount: 0,
    });

    await expect(createOrder(mockFormData)).rejects.toThrow("Cart is empty");
  });

  it("should create an order and process payment", async () => {
    mockedPrisma.cart.findFirst.mockResolvedValue({
      ...mockCart,
      totalAmount: 100,
    }); // Эмулируем найденную корзину
    mockedPrisma.order.create.mockResolvedValue({
      id: 1,
      totalAmount: 100,
      fullName: "asdasd",
      paymentId: "111111",
      email: "asdasd",
      status: "SUCCEEDED",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: "[]",
      address: "asdasd",
      phone: "asdasd",
      comment: " asd",
      userId: 0,
      token: null,
      cartId: null,
    }); // Эмулируем создание заказа
    mockedPrisma.cart.update.mockResolvedValue(mockCart); // Эмулируем обновление корзины
    mockedPrisma.cartItem.deleteMany.mockResolvedValue({
      count: 0,
    }); // Эмулируем удаление элементов корзины
    mockedCreatePayment.mockResolvedValue({
      id: "",
      status: "",
      amount: {
        value: "123",
        currency: "RUB",
      },
      description: "",
      recipient: {
        account_id: "",
        gateway_id: "",
      },
      created_at: "",
      confirmation: {
        type: "",
        confirmation_url: "https://yookassa.ru",
      },
      test: false,
      paid: false,
      refundable: false,
    }); // Эмулируем успешное создание платежа
    mockedSendEmail.mockResolvedValue({ id: "1" }); // Эмулируем успешную отправку email

    const paymentUrl = await createOrder(mockFormData);

    expect(paymentUrl).toBe("https://yookassa.ru");
  });
});

describe("updateUserInfo", () => {
  test("should throw an error if user is not found", async () => {
    mockedGetServerSession.mockResolvedValue(null);
    expect(updateUserInfo({})).rejects.toThrow("Пользователь не найден");
  });
  test("should call at least once prisma.user.update if user is found", async () => {
    mockedGetServerSession.mockResolvedValue({
      id: "1",
      role: "ADMIN",
      name: "asdasd",
      image: "asdasd",
    });
    await updateUserInfo({});
    expect(mockedPrisma.user.update).toBeCalledTimes(1);
  });
});

describe("registerUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should throw an error if user is not verified", async () => {
    mockedPrisma.user.findFirst.mockResolvedValue({
      verified: null,
      cartId: 1,
      id: 1,
      updatedAt: new Date(),
      role: "ADMIN",
      providerId: "1",
      provider: "1",
      email: "asdasd",
      fullName: "asdasd",
      password: "asdasd",
      createdAt: new Date(),
    });

    expect(
      registerUser({
        fullName: "",
        email: "",
        password: "",
      }),
    ).rejects.toThrow("Почта не подтверждена");
  });

  test("should throw an error if user is registered", async () => {
    mockedPrisma.user.findFirst.mockResolvedValue({
      verified: new Date(),
      cartId: 1,
      id: 1,
      updatedAt: new Date(),
      role: "ADMIN",
      providerId: "1",
      provider: "1",
      email: "asdasd",
      fullName: "asdasd",
      password: "asdasd",
      createdAt: new Date(),
    });

    expect(
      registerUser({
        fullName: "",
        email: "",
        password: "",
      }),
    ).rejects.toThrow("Пользователь уже существует");
  });
  test("should send and email if user is not registered", async () => {
    mockedPrisma.user.findFirst.mockResolvedValue(null);
    mockedPrisma.user.create.mockResolvedValue({
      id: 1,
      fullName: "",
      email: "",
      password: "",
      role: "USER",
      provider: null,
      providerId: null,
      cartId: null,
      verified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await registerUser({
      fullName: "",
      email: "",
      password: "",
    });
    expect(mockedSendEmail).toBeCalledTimes(1);
  });
});
