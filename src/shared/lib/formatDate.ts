/* formatDate 는 ISO 문자열에서 날짜 부분만 잘라 YYYY-MM-DD 로 만든다 */
export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}
