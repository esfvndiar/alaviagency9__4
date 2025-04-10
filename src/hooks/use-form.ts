import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { ValidationResult } from '@/utils/form-validation';
import { useErrorHandler } from '@/utils/error-handling';

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<any>;
  validate?: (values: T) => ValidationResult;
  resetOnSuccess?: boolean;
}

/**
 * Custom hook for form handling with validation and submission
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
  resetOnSuccess = true
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setStatus('idle');
    setSubmitError(null);
  }, [initialValues]);

  // Handle input changes
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof T]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  // Handle blur events for field-level validation
  const handleBlur = useCallback((e: { target: { name: string } }) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate single field if validate function exists
    if (validate) {
      const result = validate(values);
      if (!result.isValid && result.message) {
        setErrors(prev => ({
          ...prev,
          [name]: result.message
        }));
      }
    }
  }, [validate, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setSubmitError(null);
    
    // Validate all fields if validate function exists
    if (validate) {
      const result = validate(values);
      if (!result.isValid) {
        setStatus('error');
        setSubmitError(result.message || 'Validation failed');
        return;
      }
    }
    
    try {
      await onSubmit(values);
      setStatus('success');
      
      if (resetOnSuccess) {
        resetForm();
      }
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setSubmitError(errorMessage);
      handleError(error, 'Form Submission Error');
    }
  }, [values, validate, onSubmit, resetOnSuccess, resetForm, handleError]);

  // Set a specific field value programmatically
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Set a specific field error programmatically
  const setFieldError = useCallback((field: keyof T, error: string | undefined) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  // Check if form is valid
  const isValid = useCallback(() => {
    if (validate) {
      return validate(values).isValid;
    }
    return Object.keys(errors).length === 0;
  }, [validate, values, errors]);

  return {
    values,
    errors,
    touched,
    status,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    isValid,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
}

export default useForm;
