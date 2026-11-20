import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { products } from "@/content/products";
import { BackLink } from "@/components/ui/BackLink";
import { Container } from "@/components/ui/Container";
import { ProductJsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  const t = await getTranslations("products");
  const specs = await getTranslations("specs");
  const cta = await getTranslations("cta");
  const title = t(product.id);
  const body = t(`${product.id}Body`);

  return (
    <article className="pb-24 pt-28">
      <ProductJsonLd name={title} description={body} image={product.image} />
      <Container className="max-w-4xl">
        <BackLink href="/products" label={cta("back")} />
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="overflow-hidden rounded-sm border border-border bg-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-display text-4xl tracking-tight text-foreground">{title}</h1>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">{body}</p>
            {product.id === "hrm" ? (
              <div className="mt-8 space-y-4 text-text-secondary leading-relaxed">
                <p>{t("hrmLong")}</p>
                <h2 className="font-display text-2xl text-foreground">{t("hrmAttendance")}</h2>
                <p>{t("hrmAttendanceBody")}</p>
                <h2 className="font-display text-2xl text-foreground">{t("hrmPayroll")}</h2>
                <p>{t("hrmPayrollBody")}</p>
              </div>
            ) : null}
          </div>
        </div>

        <h2 className="mt-14 font-display text-2xl text-foreground">{specs("title")}</h2>
        <div className="mt-4 overflow-hidden rounded-[24px] border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-panel text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">{specs("label")}</th>
                <th className="px-4 py-3 font-medium">{specs("value")}</th>
              </tr>
            </thead>
            <tbody>
              {product.specs.map((row) => (
                <tr key={row.k} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{row.k}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </article>
  );
}
