<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useJokesStore } from '@/stores/jokes';
import ClipboardButton from '@/components/ClipboardButton.vue';
import NotFoundBox from '@/components/NotFoundBox.vue';
import LaughingSpinner from '@/components/LaughingSpinner.vue';
import ImageBox from '@/components/ImageBox.vue';

const props = defineProps({
    jokeId: {
        type: String,
        required: true
    }
});

const jokes = useJokesStore();
const jokeOption = computed(() => jokes.jokesById[props.jokeId]);
const joke = computed(() => jokeOption.value?.some);
const isNoJoke = computed(() => jokeOption.value?.isNone);
const isLoading = ref(false)

const isGeneratingJokeImage = ref(false);
const jokeImageOption = computed(() => jokes.jokeImagesById[props.jokeId]);
const jokeImage = computed(() => jokeImageOption.value?.some)

async function getJokeImage() {
    if (isGeneratingJokeImage.value) {
        return;
    }
    isGeneratingJokeImage.value = true;
    await jokes.getGeneratedJokeImage(props.jokeId);
    isGeneratingJokeImage.value = false;
}

watch(joke, () => {
    getJokeImage();
});

onMounted(async () => {
    if (jokeOption.value === undefined) {
        isLoading.value = true;
        await jokes.getJokeById(props.jokeId);
        isLoading.value = false;
    }
    await getJokeImage();
});
</script>

<template>
    <LaughingSpinner v-if="isLoading || jokeOption === undefined" />
    <NotFoundBox v-else-if="isNoJoke" />
    <article v-else-if="joke" class="p-3 text-white bg-black border border-white rounded-md bg-opacity-90">
        <ImageBox :url="jokeImage" :alt="joke?.joke" :is-loading="isGeneratingJokeImage" />
        <p class="mb-3">{{ joke?.joke }}</p>
        <div class="flex justify-end gap-2">
            <ClipboardButton :text="joke?.joke" />
        </div>
    </article>
</template>