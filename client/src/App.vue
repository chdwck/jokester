<script setup lang="ts">
import { RouterView } from "vue-router";
import Searchbar from "@/components/Searchbar.vue";
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-10 bg-purple-600 h-14">
    <Searchbar class="h-full max-w-2xl mx-auto" />
  </header>

  <main class="px-4 py-20">
    <RouterView />
  </main>

  <footer class="absolute bottom-0 left-0 right-0 flex items-center justify-center h-8 bg-purple-600 text-purple-50">
    <p>
      Memed with 😂 by
      <a class="hover:underline" href="https://www.gihub.com/chdwck">@chdwck</a>
    </p>
  </footer>
</template>
