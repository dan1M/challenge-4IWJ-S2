import { reactive, ref, computed, toRefs } from 'vue';
import { z } from 'zod';
import _ from 'lodash';
import { useToast } from '@/components/ui/toast';

export default function useCustomForm(
  initialFormData,
  validationSchema,
  submitEndpoint = '',
  method,
) {
  const baseUrl = 'http://localhost:3000/';
  const initialValues = Object.assign({}, initialFormData);
  const data = reactive(initialFormData);
  const validationErrors = reactive({});
  const serverError = ref(null);
  const isSubmitting = ref(false);
  const serverResponse = ref({});
  Object.keys(initialFormData).forEach(key => {
    validationErrors[key] = '';
  });
  let currentAbortController = null;

  const { toast } = useToast();

  const isFormValid = computed(() => {
    // Reset validation errors
    Object.keys(initialFormData).forEach(key => {
      validationErrors[key] = '';
    });
    // Check if data is equal to initial values
    if (_.isEqual(initialValues, data)) return false;

    try {
      validationSchema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        for (const issue of error.issues) {
          validationErrors[issue.path[0]] = issue.message;
        }
      }
      return false;
    }
  });

  const submitForm = async () => {
    if (!isFormValid.value) return;
    isSubmitting.value = true;

    const abortController = new AbortController();

    currentAbortController = abortController;

    try {
      const response = await fetch(baseUrl + submitEndpoint, {
        method: method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');
      }

      console.log(response.headers.getSetCookie());

      serverError.value = null;

      serverResponse.value = await response.json();

      isSubmitting.value = false;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request canceled by user!');
      } else {
        serverError.value = 'An unexpected error occurred.';
      }
    }
  };

  const cancelRequest = () => {
    if (currentAbortController) {
      currentAbortController.abort();
    }
    isSubmitting.value = false;
  };

  const resetForm = () => {
    Object.keys(data).forEach(key => {
      data[key] = '';
      validationErrors[key] = '';
    });
  };

  return {
    ...toRefs(data),
    validationErrors,
    serverError,
    serverResponse,
    isFormValid,
    isSubmitting,
    submitForm,
    cancelRequest,
    resetForm,
  };
}
