'use client';

/* 이 모듈은 아이디와 비밀번호를 받아 로그인하는 폼을 그린다 */
import { useState } from 'react';
import { z } from 'zod';
import { Alert, Input, Stack } from '@/design-system';
import { FormField, SubmitButton } from '@/shared/ui';
import { useAppForm } from '@/shared/lib';
import { useSessionStore } from '@/entities/session';

/* loginSchema 는 로그인 폼이 보내기 전에 갖춰야 할 값의 모양이다 */
const loginSchema = z.object({
  username: z.string().min(1, '아이디를 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

/* LoginForm 은 로그인 입력 두 칸과 제출 버튼을 그린다.
   로그인에 성공하면 세션 스토어가 상태를 바꾸고, 화면 이동은 상위가 맡는다 */
export function LoginForm() {
  const login = useSessionStore((state) => state.login);
  /* failed 는 로그인이 거부됐는지 기억한다. 폼 위의 Alert 가 이 값을 읽는다 */
  const [failed, setFailed] = useState(false);

  const { form, submit, isSubmitting } = useAppForm({
    schema: loginSchema,
    defaultValues: { username: '', password: '' },
    onSubmit: async (values) => {
      setFailed(false);
      try {
        await login(values);
      } catch {
        /* 실패 사유를 나누지 않는다. 어느 칸이 틀렸는지 알려 주지 않기 위해서다 */
        setFailed(true);
      }
    },
    /* 로그인 폼은 저장할 내용이 없으므로 떠날 때 확인창을 띄우지 않는다 */
    warnOnUnsavedChanges: false,
  });

  return (
    <Stack gap={4}>
      {failed && (
        <Alert tone="critical" title="로그인할 수 없습니다">
          아이디 또는 비밀번호를 확인하세요.
        </Alert>
      )}

      <form onSubmit={submit}>
        <Stack gap={4}>
          <FormField form={form} name="username" label="아이디" required>
            {(field) => (
              <Input
                id={field.id}
                autoComplete="username"
                value={String(field.value ?? '')}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                invalid={field['aria-invalid']}
                aria-describedby={field['aria-describedby']}
              />
            )}
          </FormField>

          <FormField form={form} name="password" label="비밀번호" required>
            {(field) => (
              <Input
                id={field.id}
                type="password"
                autoComplete="current-password"
                value={String(field.value ?? '')}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                invalid={field['aria-invalid']}
                aria-describedby={field['aria-describedby']}
              />
            )}
          </FormField>

          <SubmitButton loading={isSubmitting}>로그인</SubmitButton>
        </Stack>
      </form>
    </Stack>
  );
}
