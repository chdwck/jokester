<script lang="ts" setup>
import { useJokesStore } from '@/stores/jokes';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import JButton from './JButton.vue';

const router = useRouter();
const jokes = useJokesStore();

const isLoadingRandomJoke = ref(false);
async function handleClick() {
    isLoadingRandomJoke.value = true;
    const id = await jokes.getRandomJoke();
    isLoadingRandomJoke.value = false;
    if (!id) {
        router.push({ name: 'borked' });
        return;
    }

    router.push({ name: 'joke', params: { id } });
}
</script>

<template>
    <JButton class="relative" @click="handleClick" button-type="secondary">
        <span :class="{ 'text-transparent bg-transparent': isLoadingRandomJoke }">
            <slot></slot>
        </span>
        <span class="absolute inset-0 flex items-center justify-center" v-if="isLoadingRandomJoke">🤔</span>
    </JButton>
</template>
