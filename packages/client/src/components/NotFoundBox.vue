<script lang="ts" setup>
import InfoBoxVue from '@/components/InfoBox.vue';
import JButton from '@/components/JButton.vue';
</script>

<template>
    <InfoBoxVue class="max-w-2xl mx-auto">
        <img src="/mib.jpg" alt="saftey" class="mx-auto">
        <p>This joke caused too many injuries. For your safety, we have removed it.</p>
        <RouterLink :to="{ name: 'home' }">
            <JButton button-type="secondary">Back to safety</JButton>
        </RouterLink>
    </InfoBoxVue>
</template>