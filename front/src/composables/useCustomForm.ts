import { reactive, ref, computed, toRefs } from 'vue';
import { z } from 'zod';
import _ from 'lodash';
import { useToast } from '@/components/ui/toast';

interface CustomFormArgs {
  initialFormData: Record<string, unknown>;
  validationSchema: z.ZodObject<any>;
  submitEndpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export default function useCustomForm({
  initialFormData,
  validationSchema,
  submitEndpoint = '',
  method = 'POST',
}: CustomFormArgs) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const initialValues = Object.assign({}, initialFormData);
  const data = reactive(initialFormData);
  const validationErrors = reactive<Record<string, string>>({});
  const serverError = ref<string | null>(null);
  const isSubmitting = ref(false);
  const serverResponse = ref<{ canAccessDashboard?: boolean }>({});
  Object.keys(initialFormData).forEach(key => {
    validationErrors[key] = '';
  });
  let currentAbortController: AbortController | null = null;

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

    console.log('data', data);
    if (!isFormValid.value) return;
    isSubmitting.value = true;
    console.log('data', data);

    const abortController = new AbortController();

    currentAbortController = abortController;

    return fetch(baseUrl + submitEndpoint, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortController.signal,
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Something went wrong, request failed!');
        }

        serverError.value = null;
        serverResponse.value = true;
      })
      .catch(error => {
        toast({ title: 'Une erreur est survenue!', variant: 'destructive' });
        if (error.name === 'AbortError') {
          throw new Error('Request canceled by user!');
        } else {
          serverError.value = 'An unexpected error occurred.';
        }
      })
      .finally(() => {
        isSubmitting.value = false;
      });
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
