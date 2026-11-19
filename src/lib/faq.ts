import { fallbackFaqs } from "@/content/cms";
import { pickLocalized } from "@/lib/i18n-fields";
import { site } from "@/lib/site";
import type { FaqRow } from "@/types/database";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function scoreFaq(item: FaqRow, q: string) {
  return item.tags.reduce((sum, tag) => (q.includes(tag.toLowerCase()) ? sum + 1 : sum), 0);
}

export function answerFromKnowledge(question: string, locale = "en", faqs: FaqRow[] = fallbackFaqs) {
  const q = question.toLowerCase();
  const scored = faqs
    .map((item) => ({ item, score: scoreFaq(item, q) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored[0]) {
    return pickLocalized(scored[0].item.answer, locale);
  }

  return `I can help with products, services, hours, and quotes. Call ${site.phoneDisplay}, email ${site.email}, or continue on WhatsApp: ${site.whatsappUrl}`;
}
