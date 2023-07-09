<script lang="ts" setup>
import LaughingSpinner from '@/components/LaughingSpinner.vue';

defineProps({
    url: {
        type: String,
        default: null
    },
    alt: {
        type: String,
        required: true
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div class="flex items-center justify-center w-full aspect-square">
        <figure v-if="url && !isLoading">
            <img :src="url" :alt="alt" class="w-full h-auto" height="512" width="512" />
            <figcaption class="text-center">Image Generated with <a
                    href="https://platform.openai.com/docs/api-reference/images">Dall•E</a></figcaption>
        </figure>
        <LaughingSpinner v-else-if="isLoading" />
        <p v-else>
            🤖 The image robot doesn't understand this joke... yet.🤖
        </p>
    </div>
</template>