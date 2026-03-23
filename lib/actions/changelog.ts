"use server"

import { parseChangelog, NewsItem } from "../changelog-parser"

export async function getChangelogNews(): Promise<NewsItem[]> {
  return parseChangelog()
}
