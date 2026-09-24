'use client';

/* 이 모듈은 폼의 zod 검증 · 제출 중 상태 · 서버 검증 에러 표시를 한 훅으로 묶는다 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldErrors, FieldPath, FieldValues, Resolver, UseFormReturn } from 'react-hook-form';
import type { ZodType, z } from 'zod';
import { isApiError, toApiError, type ApiError } from '@/shared/api';

/* zodResolver 는 zod 스키마를 react-hook-form 이 부르는 검증 함수로 바꾼다.
   한 필드에 문제가 여러 개면 첫 번째 메시지만 남긴다 */
function zodResolver<TValues extends FieldValues>(schema: ZodType<unknown>): Resolver<TValues> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) return { values: result.data as TValues, errors: {} };

    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.map(String).join('.');
      const key = path === '' ? 'root' : path;
      if (errors[key] !== undefined) continue;
      errors[key] = { type: issue.code, message: issue.message };
    }

    return { values: {}, errors: errors as FieldErrors<TValues> };
  };
}

/* normalizeFieldPath 는 백엔드가 준 items[0].name 형태의 키를
   react-hook-form 이 쓰는 items.0.name 형태로 바꾼다 */
function normalizeFieldPath(key: string): string {
  return key.replace(/\[(\d+)\]/g, '.$1');
}

/* applyFieldErrors 는 ApiError 의 필드별 메시지를 폼의 해당 필드에 넣고,
   폼에 그 필드가 없어 넣지 못한 메시지들을 돌려준다 */
function applyFieldErrors<TValues extends FieldValues>(
  form: UseFormReturn<TValues>,
  error: ApiError,
): string[] {
  /* registered 는 폼이 실제로 등록한 필드 경로를 담는다 */
  const registered = new Set(Object.keys(form.control._fields ?? {}));
  /* unmapped 는 어느 필드에도 넣지 못한 메시지를 모은다 */
  const unmapped: string[] = [];

  for (const [rawKey, messages] of Object.entries(error.fieldErrors)) {
    const [first] = messages;
    if (first === undefined) continue;

    const path = normalizeFieldPath(rawKey);
    if (registered.has(path)) {
      form.setError(path as FieldPath<TValues>, { type: 'server', message: first });
      unmapped.push(...messages.slice(1));
    } else {
      unmapped.push(...messages);
    }
  }
  return unmapped;
}

/* useUnsavedChangesWarning 은 사용자가 고친 폼을 저장하지 않고 떠나려 할 때 확인을 받는다 */
function useUnsavedChangesWarning(
  isDirty: boolean,
  message: string,
  isSaving: () => boolean,
): void {
  /* 이 useEffect 는 브라우저가 탭을 닫거나 새로고침할 때 브라우저의 기본 확인창을 띄운다 */
  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  /* guard 는 아래 클릭 핸들러가 읽을 최신 인자를 보관한다 */
  const guard = useRef({ isDirty, message, isSaving });
  useEffect(() => {
    guard.current = { isDirty, message, isSaving };
  });

  /* 이 useEffect 는 앱 안 링크 클릭을 가로채 확인창을 띄운다.
     새 탭 · 바깥 주소 · 같은 경로로 가는 클릭은 그냥 보낸다 */
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const { isDirty: dirty, isSaving: saving, message: text } = guard.current;
      if (!dirty || saving()) return;

      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      const href = anchor?.getAttribute('href');
      if (!anchor || !href || anchor.target === '_blank' || href.startsWith('#')) return;

      const next = new URL(href, window.location.href);
      if (next.origin !== window.location.origin) return;
      if (next.pathname === window.location.pathname) return;

      if (window.confirm(text)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);
}

/* UseAppFormArgs 는 호출부가 useAppForm 에 넘기는 설정이다 */
export interface UseAppFormArgs<TSchema extends ZodType> {
  /* useAppForm 이 제출 값을 검증할 때 쓰는 zod 스키마 */
  schema: TSchema;
  /* 폼이 처음 그려질 때 각 필드에 채울 값 */
  defaultValues: z.input<TSchema>;
  /* 검증을 통과한 값을 받아 서버로 보내는 함수. 호출부가 넘긴다 */
  onSubmit: (values: z.output<TSchema>) => Promise<void>;
  /* 이 값이 true 면 useAppForm 은 사용자가 고친 폼을 떠날 때 확인창을 띄운다 */
  warnOnUnsavedChanges?: boolean;
  /* 그 확인창에 띄울 문구 */
  unsavedChangesMessage?: string;
  /* 이 값이 true 면 useAppForm 은 제출에 성공한 뒤 폼을 기본값으로 되돌린다 */
  resetOnSuccess?: boolean;
}

/* UseAppFormResult 는 useAppForm 이 화면에 돌려주는 폼 객체와 제출 상태다 */
export interface UseAppFormResult<TSchema extends ZodType> {
  /* 화면이 각 입력을 등록할 때 쓰는 react-hook-form 객체 */
  form: UseFormReturn<z.input<TSchema> & FieldValues>;
  /* 화면이 <form> 의 onSubmit 에 걸어 두는 제출 함수 */
  submit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  /* onSubmit 이 실행 중인 동안 true 다. 화면은 이 값으로 버튼을 잠근다 */
  isSubmitting: boolean;
  /* 필드로 나눌 수 없는 실패. 화면은 이 값을 폼 위에 띄운다 */
  formError: ApiError | null;
  /* 서버가 준 검증 메시지 중 폼에 그 필드가 없어 넣지 못한 것들 */
  formMessages: string[];
  /* 사용자가 폼을 한 번이라도 고쳤으면 true 다 */
  isDirty: boolean;
}

/* useAppForm 은 폼 하나를 검증 · 제출 · 에러 표시까지 맡는다.
   화면은 이 훅이 돌려준 form 과 submit 만 쓴다 */
export function useAppForm<TSchema extends ZodType>({
  schema,
  defaultValues,
  onSubmit,
  warnOnUnsavedChanges = true,
  unsavedChangesMessage = '저장하지 않은 변경사항이 있습니다. 이동하시겠습니까?',
  resetOnSuccess = false,
}: UseAppFormArgs<TSchema>): UseAppFormResult<TSchema> {
  type TValues = z.input<TSchema> & FieldValues;

  const form = useForm<TValues>({
    resolver: zodResolver<TValues>(schema),
    defaultValues: defaultValues as never,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<ApiError | null>(null);
  const [formMessages, setFormMessages] = useState<string[]>([]);

  /* submittingRef 는 제출이 진행 중인지 기억한다. submit 은 이 값으로 이중 제출을 막는다 */
  const submittingRef = useRef(false);

  /* savingRef 는 서버로 보내는 중인지 기억한다.
     useUnsavedChangesWarning 은 이 값이 true 면 확인창을 띄우지 않는다 */
  const savingRef = useRef(false);

  useUnsavedChangesWarning(
    warnOnUnsavedChanges && form.formState.isDirty,
    unsavedChangesMessage,
    () => savingRef.current,
  );

  /* submit 은 폼 값을 검증하고, 통과하면 onSubmit 에 넘긴다.
     onSubmit 이 검증 실패로 던지면 그 메시지를 각 필드에 넣고, 나머지 실패는 formError 에 담는다 */
  const submit = useCallback(
    async (event?: React.BaseSyntheticEvent) => {
      event?.preventDefault();

      if (submittingRef.current) return;
      submittingRef.current = true;

      setFormError(null);
      setFormMessages([]);

      try {
        await form.handleSubmit(async (values) => {
          setIsSubmitting(true);
          savingRef.current = true;
          try {
            await onSubmit(values as z.output<TSchema>);
            if (resetOnSuccess) form.reset();
            else form.reset(values as never, { keepValues: true });
          } catch (caught) {
            savingRef.current = false;
            const error = toApiError(caught);
            if (isApiError(error) && error.kind === 'validation') {
              setFormMessages(applyFieldErrors(form, error));
            } else {
              setFormError(error);
            }
          } finally {
            setIsSubmitting(false);
          }
        })(event);
      } finally {
        submittingRef.current = false;
      }
    },
    [form, onSubmit, resetOnSuccess],
  );

  return {
    form,
    submit,
    isSubmitting,
    formError,
    formMessages,
    isDirty: form.formState.isDirty,
  };
}
