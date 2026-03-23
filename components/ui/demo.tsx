"use client";

import { News, type NewsArticle } from "@/components/ui/sidebar-news";
import Plan from "@/components/ui/agent-plan";

const DEMO_ARTICLES: NewsArticle[] = [
  {
    href: "https://dub.co/changelog/regions-support",
    title: "Regions support in analytics",
    summary: "You can now filter your analytics by regions",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    href: "https://dub.co/blog/soc2",
    title: "Dub is now SOC 2 Type II Compliant",
    summary:
      "We're excited to announce that Dub has successfully completed a SOC 2 Type II audit to further demonstrate our commitment to security.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
  },
  {
    href: "https://dub.co/changelog/utm-templates",
    title: "UTM Templates",
    summary:
      "You can now create UTM templates to streamline UTM campaign management across your team.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
];

export function NewsDemo() {
  return (
    <div className="h-[600px] w-56 relative bg-gradient-to-br from-background to-muted">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56">
        <News articles={DEMO_ARTICLES} />
      </div>
    </div>
  );
}

export function Demo() {
  return (
    <div className="flex flex-col p-4 w-full h-[600px] md:flex-row gap-8">
      <NewsDemo />
      <div className="flex-1">
        <Plan />
      </div>
    </div>
  );
}
