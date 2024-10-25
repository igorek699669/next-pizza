import { FC } from "react";
import { Title } from "./title";
import { FilterCheckbox } from "./filter-checkbox";
import { Input } from "../ui/input";
import { RangeSlider } from "./range-slider";
import CheckboxFiltersGroup from "./checkbox-filters-group";
import { text } from "stream/consumers";

interface filtersProps {
  className?: string;
}

const filters: FC<filtersProps> = ({ className }) => {
  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />
      <div className="flex flex-col gap-4">
        <FilterCheckbox text="Можно собирать" value="1" />
        <FilterCheckbox text="Новинки" value="2" />
      </div>
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input type="number" placeholder="0" min={0} max={1000} />
          <Input type="number" min={100} max={1000} placeholder="1000" />
        </div>

        <RangeSlider max={1000} min={100} step={1} />
      </div>
      <CheckboxFiltersGroup
        title="Ингридиенты"
        className="mt-5"
        limit={6}
        items={[
          { text: "Сырный соус", value: "1" },
          { text: "Моцарелла", value: "2" },
          { text: "Чеснок", value: "3" },
          { text: "Сырный соус", value: "1" },
          { text: "Моцарелла", value: "2" },
          { text: "Чеснок", value: "3" },
          { text: "Сырный соус", value: "1" },
          { text: "Моцарелла", value: "2" },
          { text: "Чеснок", value: "3" },
        ]}
        defaultItems={[
          { text: "Сырный соус", value: "1" },
          { text: "Моцарелла", value: "2" },
          { text: "Чеснок", value: "3" },
          { text: "Сырный соус", value: "1" },
          { text: "Моцарелла", value: "2" },
          { text: "Чеснок", value: "3" },
          { text: "Сырный соус", value: "1" },
          { text: "Моцарелла", value: "2" },
          { text: "Чеснок", value: "3" },
        ]}
      />
    </div>
  );
};

export default filters;
