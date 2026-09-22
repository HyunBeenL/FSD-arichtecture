/* 이 모듈은 Pagination 이 그릴 페이지 번호 목록을 고른다 */

/* PAGE_ELLIPSIS 는 페이지 번호 목록에서 말줄임 자리를 가리키는 표식이다 */
export const PAGE_ELLIPSIS = -1;

/* pageNumbers 는 처음 · 끝 · 현재 페이지 양옆 sibling 개만 남기고
   그 사이를 PAGE_ELLIPSIS 로 접은 번호 목록을 돌려준다 */
export function pageNumbers(current: number, total: number, sibling = 1): number[] {
  if (total <= 1) return total === 1 ? [1] : [];

  /* pages 는 남길 번호를 중복 없이 모은다 */
  const pages = new Set<number>([1, total, current]);
  for (let offset = 1; offset <= sibling; offset += 1) {
    if (current - offset >= 1) pages.add(current - offset);
    if (current + offset <= total) pages.add(current + offset);
  }

  /* 이 반복문은 번호를 오름차순으로 훑으며 끊긴 자리에 PAGE_ELLIPSIS 를 끼운다 */
  const sorted = [...pages].sort((a, b) => a - b);
  const result: number[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous !== 0 && page - previous > 1) result.push(PAGE_ELLIPSIS);
    result.push(page);
    previous = page;
  }
  return result;
}
