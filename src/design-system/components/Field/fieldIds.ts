export interface FieldIds {
  descriptionId?: string;
  errorId?: string;
  describedBy?: string;
}

export function fieldIds(
  htmlFor: string | undefined,
  has: { description?: boolean; error?: boolean },
): FieldIds {
  const base = htmlFor ?? 'field';
  const descriptionId = has.description ? `${base}-desc` : undefined;
  const errorId = has.error ? `${base}-err` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  return { descriptionId, errorId, describedBy };
}
