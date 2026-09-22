/* 이 모듈은 폼의 주 액션에 쓰는 제출 버튼을 준다 */
import { Button, type ButtonProps } from '@/design-system';

/* SubmitButtonProps 는 Button 의 props 중 SubmitButton 이 직접 정하는 것을 뺀 나머지다 */
export interface SubmitButtonProps extends Omit<
  ButtonProps,
  'type' | 'variant' | 'tone' | 'asChild'
> {
  /* 이 값이 true 면 Button 은 스피너를 그리고 클릭을 받지 않는다 */
  loading?: boolean;
}

/* SubmitButton 은 type="submit" 과 solid · brand 모양을 고정한 Button 이다.
   화면은 폼을 제출하는 버튼에 이 컴포넌트를 쓴다 */
export function SubmitButton({ loading, ...props }: SubmitButtonProps) {
  return <Button type="submit" loading={loading} {...props} />;
}
