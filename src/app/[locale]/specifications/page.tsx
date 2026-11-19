import { getTranslations, setRequestLocale } from "next-intl/server";
import { products } from "@/content/products";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default async function SpecificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("specs");
  const productsT = await getTranslations("products");

  return (
    <article className="pb-24 pt-28">
      <Container className="max-w-4xl">
        <SectionHeader as="h1" kicker={t("kicker")} title={t("title")} lead={t("lead")} />
        <div className="mt-14 space-y-14">
          {products.map((product) => (
            <section key={product.id} id={product.id}>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl">{productsT(product.id)}</h2>
                <Link
                  href={`/products/${product.id}`}
                  className="text-sm text-accent hover:underline"
                >
                  {product.id}
                </Link>
              </div>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {product.specs.map((row) => (
                    <tr key={row.k} className="border-b border-line">
                      <td className="w-1/3 py-3 text-foreground">{row.k}</td>
                      <td className="py-3 text-mist">{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
