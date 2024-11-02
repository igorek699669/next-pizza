import { Api } from "@/shared/services/api-client";
import { Ingridient } from "@prisma/client";
import { useEffect, useState } from "react";

export type IngredientItem = Pick<Ingridient, "id" | "name">;
export const useIngredients = () => {
  const [ingredients, setItems] = useState<IngredientItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Api.ingredients
      .getAll()
      .then((data) => {
        setItems(data.map((item) => ({ id: item.id, name: item.name })));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return { ingredients, loading };
};
