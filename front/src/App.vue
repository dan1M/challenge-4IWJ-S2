<script lang="ts">
//@ts-nocheck
import Toaster from '@/components/ui/toast/Toaster.vue';
import AppCookieBanner from './components/AppCookieBanner.vue';
export default {
  name: 'App',
  data: function () {
    return {
      showBanner: !(
        this.$posthog.has_opted_out_capturing() ||
        this.$posthog.has_opted_in_capturing()
      ),
    };
  },
  components: {
    Toaster,
    AppCookieBanner,
  },
};
</script>

<template>
  <AppCookieBanner v-if="showBanner" @hideBanner="showBanner = false" />
  <router-view></router-view>
  <Toaster />
</template>

<style scoped></style>
