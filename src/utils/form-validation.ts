/**
 * Form validation utility functions
 * Provides reusable validation logic for forms across the application
 */

import { siteConfig } from '../config/site-config';

export type ValidationResult = {
  isValid: boolean;
  message?: string;
};

/**
 * Validates a required field
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      message: `${fieldName} is required`
    };
  }
  return { isValid: true };
};

/**
 * Validates a field's length
 */
export const validateLength = (
  value: string, 
  fieldName: string, 
  minLength?: number, 
  maxLength?: number
): ValidationResult => {
  if (minLength && value.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${minLength} characters`
    };
  }
  
  if (maxLength && value.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} cannot exceed ${maxLength} characters`
    };
  }
  
  return { isValid: true };
};

/**
 * Validates an email address
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailPattern = siteConfig.forms.contact.validation.email.pattern;
  
  if (!email || !emailPattern.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }
  
  return { isValid: true };
};

/**
 * Validates a phone number
 */
export const validatePhone = (phone: string): ValidationResult => {
  // Basic phone validation - can be customized based on region/requirements
  const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  
  if (!phone || !phonePattern.test(phone)) {
    return {
      isValid: false,
      message: 'Please enter a valid phone number'
    };
  }
  
  return { isValid: true };
};

/**
 * Validates a URL
 */
export const validateUrl = (url: string): ValidationResult => {
  try {
    new URL(url);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      message: 'Please enter a valid URL'
    };
  }
};

/**
 * Validates a contact form
 */
export const validateContactForm = (formData: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): ValidationResult => {
  const { validation } = siteConfig.forms.contact;
  
  // Check name
  const nameValidation = validateLength(
    formData.name, 
    'Name', 
    validation.name.minLength, 
    validation.name.maxLength
  );
  if (!nameValidation.isValid) return nameValidation;
  
  // Check email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) return emailValidation;
  
  // Check subject (if required)
  if (validation.subject.required) {
    const subjectValidation = validateRequired(formData.subject || '', 'Subject');
    if (!subjectValidation.isValid) return subjectValidation;
  }
  
  // Check subject length (if provided)
  if (formData.subject && validation.subject.maxLength) {
    const subjectLengthValidation = validateLength(
      formData.subject, 
      'Subject', 
      undefined, 
      validation.subject.maxLength
    );
    if (!subjectLengthValidation.isValid) return subjectLengthValidation;
  }
  
  // Check message
  const messageValidation = validateLength(
    formData.message, 
    'Message', 
    validation.message.minLength, 
    validation.message.maxLength
  );
  if (!messageValidation.isValid) return messageValidation;
  
  return { isValid: true };
};

export default {
  validateRequired,
  validateLength,
  validateEmail,
  validatePhone,
  validateUrl,
  validateContactForm
};
