import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToast } from '@/components/ui/toast';

const { toast } = useToast();


export const LANGUAGES = [
    { name: 'Français (fr)', code: 'fr' },
    { name: 'English (en)', code: 'en' },
];

export const useAlertStore = defineStore('alert', () => {
    const alerts = ref([]);
    const alertType = ref(null);
    const actualLanguage = ref(LANGUAGES[0]);
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const endpoint = `/alerts/`;
    const endpointAlertType = `/alert-type/`;


    const updateLanguage = (language: string) => {
        actualLanguage.value =
            LANGUAGES[LANGUAGES.findIndex(l => l.code === language)];
    };

    const getUserAlerts = async (userId) => {
        try {
            const response = await fetch(baseUrl + endpoint + userId, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Something went wrong, request failed!');
            }
            alerts.value = await response.json();

            console.log(alerts.value);

        } catch (err) {
            console.log(err);
        }
    };

    const getAlertType = async (alertTypeId) => {
        try {
            const response = await fetch(baseUrl + endpointAlertType + alertTypeId, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Something went wrong, request failed!');
            }
            alertType.value = await response.json();

            console.log(alertType.value);

        } catch (err) {
            console.log(err);
        }
    };

    const updateAlerts = async (userId, body) => {
        try {
            const response = await fetch(baseUrl + endpoint + userId, {
                method: 'PATCH',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Something went wrong, request failed!');
            }
            toast({
                title: 'Vos alertes ont bien été mises à jour.',
                variant: 'default',
            });

        } catch (err) {
            console.log(err);
        }
    };
    return {
        getUserAlerts,
        getAlertType,
        updateLanguage,
        updateAlerts,
        alerts,
        alertType
    };
});


