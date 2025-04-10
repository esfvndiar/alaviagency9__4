import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { ValidationResult } from '@/utils/form-validation';
import { useErrorHandler } from '@/utils/error-handling';

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<unknown>;
  validate?: (values: T) => ValidationResult;
  resetOnSuccess?: boolean;
}

/**
 * Custom hook for form handling with validation and submission
 */
export function useForm<T extends Record<string, unknown>>({
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
    
    // Clear error for this field when it changes
    if (errors[name as keyof T]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  // Mark field as touched on blur
  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate single field on blur if validation function exists
    if (validate) {
      const result = validate(values);
      if (!result.isValid && result.errors && result.errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name as keyof T]: result.errors?.[name] || ''
        }));
      }
    }
  }, [validate, values]);

  // Set a specific field value programmatically
  const setFieldValue = useCallback((name: keyof T, value: unknown) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when it changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  // Set multiple field values at once
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
    
    // Clear errors for changed fields
    const changedFields = Object.keys(newValues);
    if (changedFields.some(field => errors[field as keyof T])) {
      const clearedErrors = { ...errors };
      changedFields.forEach(field => {
        if (errors[field as keyof T]) {
          clearedErrors[field as keyof T] = undefined;
        }
      });
      setErrors(clearedErrors);
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    
    // Validate all fields if validation function exists
    if (validate) {
      const result = validate(values);
      if (!result.isValid) {
        if (result.errors) {
          // Convert errors to the correct type
          const typedErrors: Partial<Record<keyof T, string>> = {};
          Object.keys(result.errors).forEach(key => {
            if (key in values) {
              typedErrors[key as keyof T] = result.errors![key];
            }
          });
          setErrors(typedErrors);
          
          // Mark all fields with errors as touched
          const newTouched: Partial<Record<keyof T, boolean>> = {};
          Object.keys(result.errors).forEach(key => {
            if (key in values) {
              newTouched[key as keyof T] = true;
            }
          });
          setTouched(prev => ({
            ...prev,
            ...newTouched
          }));
        } else if (result.message) {
          // Handle general error message
          setSubmitError(result.message);
        }
        return false;
      }
    }
    
    try {
      setStatus('submitting');
      setSubmitError(null);
      
      await onSubmit(values);
      
      setStatus('success');
      if (resetOnSuccess) {
        resetForm();
      }
      return true;
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setSubmitError(errorMessage);
      handleError(error);
      return false;
    }
  }, [validate, values, onSubmit, resetOnSuccess, resetForm, handleError]);

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
    setMultipleValues,
    resetForm
  };
}

export default useForm;
