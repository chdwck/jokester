<script lang="ts" setup>
import { computed } from "vue";
import { type JokeResponse } from "@/lib/DadJokeApiClient";
import JButton from "./JButton.vue";
import ClipboardButton from "@/components/ClipboardButton.vue";

const props = defineProps<{ joke: JokeResponse }>();
const jokeRoute = computed(() => ({ name: 'joke', params: { id: props.joke.id } }));
</script>

<template>
  <article class="p-3 text-white bg-black border border-white rounded-md bg-opacity-90">
    <p class="mb-3">{{ joke.joke }}</p>
    <div class="flex justify-end gap-2">
      <ClipboardButton :text="joke.joke" />
      <RouterLink :to="jokeRoute">
        <JButton button-type="secondary" title="Go to joke page">
          👀
        </JButton>
      </RouterLink>
    </div>
  </article>
</template>
