import { notFound } from "next/navigation";
import { prisma } from "../../../../prisma/prisma-client";
import { Container } from "@/components/shared/container";
import ProductImage from "@/components/shared/product-image";
import { Title } from "@/components/shared/title";
import { GroupVariants } from "@/components/shared/group-variants";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingridients: true,
      category: {
        include: {
          products: {
            include: {
              items: true,
            },
          },
        },
      },
      items: true,
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-10">
      <div className="flex flex-1">
        <ProductImage imageUrl={product.imageUrl} className="mb-10" size={40} />
        <div className="w-[490px] bg-[#f7f6f5] p-7">
          <Title
            text={product.name}
            size="md"
            className="font-extrabold mb-1"
          />

          <p className="text-gray-400">lorem10 lorem10</p>

          <div className="flex flex-col gap-4 mt-5">
            <GroupVariants
              items={[
                { name: "30 см", value: "30" },
                { name: "40 см", value: "40" },
                { name: "50 см", value: "50" },
              ]}
              value={String("30")}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
