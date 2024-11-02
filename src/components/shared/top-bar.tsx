import { cn } from "@/shared/lib/utils";
import { FC } from "react";
import { Container } from "./container";
import Categories from "./categories";
import SortPopup from "./sort-popup";
import { Category } from "@prisma/client";

interface topBarProps {
  items: Category[];
  className?: string;
}

export const TopBar: FC<topBarProps> = ({ items, className }) => {
  return (
    <div
      className={cn(
        "sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10",
        className,
      )}
    >
      <Container className="flex items-center justify-between">
        <Categories items={items} />
        <SortPopup />
      </Container>
    </div>
  );
};

export default TopBar;
