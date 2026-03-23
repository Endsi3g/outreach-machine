import fs from 'fs'
import path from 'path'

export interface NewsItem {
  title: string
  description: string
  date: string
  tag?: string
}

export function parseChangelog(): NewsItem[] {
  try {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
    if (!fs.existsSync(changelogPath)) return []

    const content = fs.readFileSync(changelogPath, 'utf8')
    const sections = content.split('## ').slice(1) // Skip "Changelog" header

    const news: NewsItem[] = []

    for (const section of sections) {
      const lines = section.split('\n')
      const headerLine = lines[0] // e.g., "[3.7.1] - 2026-03-22"
      
      const versionMatch = headerLine.match(/\[(.*?)\]/)
      const dateMatch = headerLine.match(/(\d{4}-\d{2}-\d{2})/)
      
      const version = versionMatch ? versionMatch[1] : ''
      const date = dateMatch ? dateMatch[1] : ''

      // Find the first interesting item in this version
      // We look for "### Added" or "### Fixed" labels
      let description = ''
      let firstItem = ''

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.startsWith('- **')) {
          const match = line.match(/\- \*\*(.*?)\*\*: (.*)/)
          if (match) {
            firstItem = match[1]
            description = match[2]
            break
          }
        } else if (line.startsWith('- ')) {
          description = line.replace('- ', '')
          break
        }
      }

      if (version && description) {
        news.push({
          title: version,
          description: description.length > 60 ? description.substring(0, 57) + '...' : description,
          date: date,
          tag: "Nouvelle Version"
        })
      }

      // Limit to last 3 news items
      if (news.length >= 3) break
    }

    return news
  } catch (error) {
    console.error('Error parsing changelog:', error)
    return []
  }
}
