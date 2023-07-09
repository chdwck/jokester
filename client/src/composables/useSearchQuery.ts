import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default function useSearchQuery() {
  const route = useRoute();
  const router = useRouter();
  const searchQuery = computed(() => route.query.q?.toString());
  function setSearchQuery(query?: string) {
    if (!query) {
      router.push({ name: "home" });
      return;
    }
    router.push({ name: 'home', query: { q: query } });
  }
  return { searchQuery, setSearchQuery };
}
