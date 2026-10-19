import { products } from "@/data/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id || p.sku === id);
  if (!product) {
    return {
      title: "Fastener Not Found | FOIF",
    };
  }
  return {
    title: `${product.name} (${product.sku}) | FOIF Industrial Fasteners`,
    description: `${product.standard} - ${product.description}. Sourced by Fortress of Industrial Fasteners.`,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id || p.sku === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
