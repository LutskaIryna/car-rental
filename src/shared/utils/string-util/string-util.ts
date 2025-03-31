export class StringUtil {
  static createSearchTerms(query: string): string {
    return query
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((term) => `${term}:*`)
      .join(' & ');
  }
}
