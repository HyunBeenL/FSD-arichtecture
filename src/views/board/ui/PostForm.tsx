'use client';

/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 글쓰기와 글 수정이 함께 쓰는 입력 폼을 그린다 */
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Alert, Input, Stack, Text, Textarea } from '@/design-system';
import { errorMessageKey } from '@/shared/api';
import { useAppForm } from '@/shared/lib';
import { FormField, SubmitButton } from '@/shared/ui';

/* TITLE_MIN_LENGTH 와 TITLE_MAX_LENGTH 는 제목 길이의 아래위 한계다.
   백엔드가 막는 길이와 같은 값이어야 한다 */
const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 60;

/* postFormSchema 는 폼이 보내기 전에 갖춰야 할 값의 모양이다 */
const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(TITLE_MIN_LENGTH, `제목은 ${TITLE_MIN_LENGTH}자 이상이어야 합니다`)
    .max(TITLE_MAX_LENGTH, `제목은 ${TITLE_MAX_LENGTH}자를 넘을 수 없습니다`),
  content: z.string(),
});

/* PostFormValues 는 이 폼이 상위 화면에 넘기는 값이다 */
export type PostFormValues = z.infer<typeof postFormSchema>;

/* PostFormProps 는 화면이 PostForm 에 넘기는 props 다 */
export interface PostFormProps {
  /* 폼이 처음 그려질 때 채울 값. 글쓰기 화면은 넘기지 않는다 */
  defaultValues?: PostFormValues;
  /* 제출 버튼에 그릴 문구 */
  submitLabel: string;
  /* 검증을 통과한 값을 받아 저장하는 함수. 화면이 넘긴다 */
  onSubmit: (values: PostFormValues) => Promise<void>;
}

/* PostForm 은 제목과 내용 입력을 그리고 검증한다.
   저장한 뒤 어디로 갈지는 이 폼을 쓰는 화면이 정한다 */
export function PostForm({ defaultValues, submitLabel, onSubmit }: PostFormProps) {
  const { t } = useTranslation();

  const { form, submit, isSubmitting, formError, formMessages, isDirty } = useAppForm({
    schema: postFormSchema,
    defaultValues: defaultValues ?? { title: '', content: '' },
    onSubmit,
    warnOnUnsavedChanges: true,
  });

  return (
    <form onSubmit={submit}>
      <Stack gap={4}>
        {formError && <Alert tone="critical" title={t(errorMessageKey(formError))} />}

        {/* 백엔드가 준 검증 메시지 중 입력 칸에 붙이지 못한 것을 폼 위에 띄운다 */}
        {formMessages.map((message) => (
          <Alert key={message} tone="critical" title={message} />
        ))}

        <FormField form={form} name="title" label="제목" required>
          {(field) => (
            <Input
              id={field.id}
              value={String(field.value ?? '')}
              onChange={(event) => field.onChange(event.target.value)}
              onBlur={field.onBlur}
              invalid={field['aria-invalid']}
              aria-describedby={field['aria-describedby']}
            />
          )}
        </FormField>

        <FormField form={form} name="content" label="내용">
          {(field) => (
            <Textarea
              id={field.id}
              value={String(field.value ?? '')}
              onChange={(event) => field.onChange(event.target.value)}
              onBlur={field.onBlur}
              invalid={field['aria-invalid']}
              aria-describedby={field['aria-describedby']}
              autoResize
              maxRows={16}
            />
          )}
        </FormField>

        <Stack direction="row" gap={2} align="center">
          <SubmitButton loading={isSubmitting}>{submitLabel}</SubmitButton>
          {isDirty && (
            <Text size="caption" tone="muted">
              저장하지 않은 변경이 있습니다
            </Text>
          )}
        </Stack>
      </Stack>
    </form>
  );
}
