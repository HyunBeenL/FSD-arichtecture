'use client';

/* 이 모듈은 라벨 · 설명 · 에러 메시지와 입력 하나를 묶어 그린다 */
import { useId } from 'react';
import { Controller } from 'react-hook-form';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { Field, fieldIds } from '@/design-system';

/* FormFieldRenderProps 는 FormField 가 children 함수에 넘기는 입력 연결 값이다 */
export interface FormFieldRenderProps {
  /* 입력이 지금 그려야 할 값 */
  value: unknown;
  /* 입력이 값을 바꿀 때 부르는 함수 */
  onChange: (value: unknown) => void;
  /* 입력이 포커스를 잃을 때 부르는 함수 */
  onBlur: () => void;
  /* 라벨이 가리키는 입력의 id */
  id: string;
  /* 이 필드에 검증 에러가 있으면 true 다. 보조 기술이 이 값을 읽는다 */
  'aria-invalid': boolean;
  /* 이 입력을 설명하는 요소들의 id. 설명 문구와 에러 메시지를 가리킨다 */
  'aria-describedby': string | undefined;
}

/* FormFieldProps 는 화면이 FormField 에 넘기는 props 다 */
export interface FormFieldProps<TValues extends FieldValues> {
  /* useAppForm 이 돌려준 react-hook-form 객체 */
  form: UseFormReturn<TValues>;
  /* 이 필드가 폼에서 차지하는 이름 */
  name: FieldPath<TValues>;
  /* 입력 위에 그릴 라벨 문구 */
  label: string;
  /* 라벨 아래에 그릴 설명 문구 */
  description?: string;
  /* 이 값이 true 면 Field 는 라벨에 필수 표시를 붙인다 */
  required?: boolean;
  /* 입력을 그리는 함수. FormField 가 연결 값을 넘긴다 */
  children: (field: FormFieldRenderProps) => React.ReactNode;
}

/* FormField 는 폼의 한 필드를 라벨 · 설명 · 에러와 함께 그리고,
   그 입력을 react-hook-form 에 연결한다 */
export function FormField<TValues extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  children,
}: FormFieldProps<TValues>) {
  const uid = useId();
  /* controlId 는 라벨 · 설명 · 에러가 같은 입력을 가리키게 하는 id 다 */
  const controlId = `${uid}-${name}`;

  /* errorMessage 는 이 필드에 붙은 검증 메시지다. 없으면 undefined 다 */
  const error = form.formState.errors[name]?.message;
  const errorMessage = typeof error === 'string' ? error : undefined;

  /* describedBy 는 이 입력이 aria-describedby 로 가리킬 id 들을 합친 문자열이다 */
  const { describedBy } = fieldIds(controlId, {
    description: Boolean(description),
    error: Boolean(errorMessage),
  });

  return (
    <Field
      label={label}
      htmlFor={controlId}
      description={description}
      error={errorMessage}
      required={required}
    >
      <Controller
        control={form.control}
        name={name}
        render={({ field }) =>
          children({
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
            id: controlId,
            'aria-invalid': Boolean(errorMessage),
            'aria-describedby': describedBy,
          }) as React.ReactElement
        }
      />
    </Field>
  );
}
