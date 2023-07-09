<script lang="ts" setup>
import InfoBoxVue from '@/components/InfoBox.vue';
import JButton from '@/components/JButton.vue';
</script>

<template>
    <InfoBoxVue class="max-w-2xl mx-auto">
        <p>😵‍💫Something went wrong.😵‍💫</p>
        <RouterLink :to="{ name: 'home' }">
            <JButton button-type="secondary">Back to safety</JButton>
        </RouterLink>
    </InfoBoxVue>
</template>