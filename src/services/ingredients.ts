import { Ingridient } from "@prisma/client";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const getAll = async (): Promise<Ingridient[]> => {
  const { data } = await axiosInstance.get<Ingridient[]>(ApiRoutes.INGREDIENTS);
  return data;
};
