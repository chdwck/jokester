<script lang="ts" setup>
import { watch, ref } from "vue";
import useSearchQuery from "@/composables/useSearchQuery";
import JButton from "@/components/JButton.vue";
import RandomJokeButton from "@/components/RandomJokeButton.vue";

const { searchQuery, setSearchQuery } = useSearchQuery();
const localQuery = ref("");

watch(searchQuery, (newSearchQuery) => {
  localQuery.value = newSearchQuery ?? '';
});

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    setSearchQuery(localQuery.value);
    return;
  }
}

function handleSearchClick() {
  setSearchQuery(localQuery.value);
}
</script>

<template>
  <div class="grid grid-cols-[1fr_auto] px-2 gap-2">
    <div class="flex items-center gap-3">
      <span>🔎</span>
      <input
        class="flex-grow h-10 px-1 py-2 text-base text-white bg-transparent border-b border-white rounded-none outline-none"
        v-model="localQuery" @keydown="handleKeydown" />
    </div>
    <div class="flex items-center gap-1">
      <JButton button-type="primary" @click="handleSearchClick">Go</JButton>
      <RandomJokeButton>Random!</RandomJokeButton>
    </div>
  </div>
</template>
