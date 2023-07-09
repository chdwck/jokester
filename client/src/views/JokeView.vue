<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import JokePresentation from '@/components/JokePresentation.vue';

const route = useRoute();
const jokeId = computed(() => route.params.id as string);
</script>

<template>
    <JokePresentation class="max-w-2xl mx-auto" :joke-id="jokeId" />
</template>