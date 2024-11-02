import { cn } from "@/shared/lib/utils";
import { FC } from "react";
import { Container } from "./container";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import CartButton from "./cart-button";

interface headerProps {
  className?: string;
}

const header: FC<headerProps> = ({ className }) => {
  return (
    <header className={cn("border border-b", className)}>
      <Container className="flex w-full items-center justify-between py-8">
        <Link href={"/"}>
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="" width={35} height={35} />
            <div>
              <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
              <p
                className="text-sm
               text-gray-400 leading-3"
              >
                вкусней уже некуда
              </p>
            </div>
          </div>
        </Link>
        <div className="mx-10 flex-1">
          <SearchInput />
        </div>
        <div className="flex items-center gap-3">
          <Button className={"flex items-center gap-1"} variant="outline">
            <User size={16} />
            Войти
          </Button>
          <div>
            <CartButton />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default header;
