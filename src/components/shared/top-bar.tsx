import { cn } from "@/lib/utils";
import { FC } from "react";
import { Container } from "./container";
import Categories from "./categories";
import SortPopup from "./sort-popup";

interface topBarProps {
  className?: string;
}

export const topBar: FC<topBarProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10",
        className,
      )}
    >
      <Container className="flex items-center justify-between">
        <Categories />
        <SortPopup />
      </Container>
    </div>
  );
};

export default topBar;
