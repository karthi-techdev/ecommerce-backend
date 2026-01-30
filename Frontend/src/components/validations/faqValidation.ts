export interface FaqFormData {
  question: string;
  answer: string;
}

export interface ValidationErrors {
  question?: string;
  answer?: string;
}

export const validateFaqForm = (data: FaqFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate question
  if (!data.question) {
    errors.question = 'Question is required.';
  } else if (data.question.trim().length < 5) {
    errors.question = 'Question must be at least 5 characters long.';
  } else if (!data.question.trim()) {
    errors.question = 'Question cannot start with space.';
  } else if (!/[a-zA-Z]/.test(data.question)) {
    errors.question = 'Question must contain at least one letter.';
  }

  // Validate answer
  if (!data.answer) {
    errors.answer = 'Answer is required.';
  } else if (data.answer.trim().length < 10) {
    errors.answer = 'Answer must be at least 10 characters long.';
  } else if (!data.answer.trim()) {
    errors.answer = 'Answer cannot start with space.';
  } else if (!/[a-zA-Z]/.test(data.answer)) {
    errors.answer = 'Answer must contain at least one letter.';
  }

  return errors;
};