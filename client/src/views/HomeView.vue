<script setup lang="ts">
import { watch, ref, computed, onMounted } from "vue";
import { useJokesStore } from "@/stores/jokes";
import useSearchQuery from "@/composables/useSearchQuery";
import JokeItem from "@/components/JokeItem.vue";
import LaughingSpinner from "@/components/LaughingSpinner.vue";
import InfoBox from "@/components/InfoBox.vue";
import RandomJokeButton from "@/components/RandomJokeButton.vue";

const { searchQuery } = useSearchQuery();
const jokes = useJokesStore();

const loadMoreTrigger = ref<InstanceType<typeof LaughingSpinner> | null>(null)
const isLoading = ref(false);
const hasResults = computed(() => jokes.searchList.length > 0 && !isLoading.value);
const hasNoResults = computed(() => jokes.searchList.length === 0 && !isLoading.value);

watch(searchQuery, () => {
  getSearchResults();
  document.body.scrollTo({ top: 0, behavior: 'smooth' });
});

watch(loadMoreTrigger, (wrapper) => {
  if (!wrapper?.$el) {
    return;
  }
  const el = wrapper.$el;

  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      await jokes.getMoreSearchResults();
    }
  }, { threshold: 0, rootMargin: '100px' });
  observer.observe(el);
})

onMounted(() => {
  document.body.scrollTo({ top: 0 });
  getSearchResults();

  if (loadMoreTrigger.value === null) {
    return;
  }
});

async function getSearchResults() {
  isLoading.value = true;
  await jokes.getSearchResults({ term: searchQuery.value });
  isLoading.value = false;
}
</script>

<template>
  <section>
    <InfoBox class="max-w-2xl mx-auto" v-if="hasNoResults">
      <p>No jokes found 😢</p>
      <RandomJokeButton>Try a random joke?</RandomJokeButton>
    </InfoBox>
    <div class="flex flex-col max-w-2xl gap-3 mx-auto">
      <JokeItem v-for="joke in jokes.searchList" :key="joke.id" :joke="joke" />
      <LaughingSpinner ref="loadMoreTrigger" v-if="!jokes.isPrevSearchAtEnd && hasResults" />
    </div>
  </section>
</template>
