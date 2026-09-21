import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스 병합.
 *
 * 사용처가 `className` 으로 준 값이 컴포넌트 기본값을 이기도록, Tailwind 의
 * 충돌 그룹을 해소한 뒤 합칩니다.
 *
 * 기본 팔레트를 `--color-*: initial` 로 걷어냈으므로(tokens/semantic.css),
 * `tailwind-merge` 가 커스텀 색 유틸리티의 충돌 그룹을 모를 수 있습니다.
 * `cn('bg-surface', 'bg-brand')` 가 하나만 남기는지 확인하고, 어긋나면
 * `extendTailwindMerge` 로 등록합니다.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
