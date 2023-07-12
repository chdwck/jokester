import { ref, type Ref, computed, type ComputedRef } from "vue";
import { defineStore } from "pinia";
import DadJokeApiClient, {
  type JokeSearchParams,
  type JokeResponse,
} from "@/lib/DadJokeApiClient";
import Option from "@/lib/common/Option";
import DalleImageApiClient from "@/lib/DalleImageApiClient";

type JokeRecord = Record<string, Option<JokeResponse>>;
type JokesStore = {
  jokesById: Ref<JokeRecord>;
  jokeImagesById: Ref<Record<string, Option<string>>>;
  jokeSearchList: Ref<string[]>;
  isPrevSearchAtEnd: Ref<boolean>;
  currentPage: Ref<number>;
  currentSearchTerm: Ref<string>;

  getSearchResults: (params: JokeSearchParams) => Promise<void>;
  getMoreSearchResults: () => Promise<void>;
  getRandomJoke: () => Promise<string | undefined>;
  getJokeById: (id: string) => Promise<void>;
  getGeneratedJokeImage: (id: string, refresh?: boolean) => Promise<void>;

  searchList: ComputedRef<JokeResponse[]>;
};
export const useJokesStore = defineStore("jokes", () => {
  const dalleImageApiClient = new DalleImageApiClient();
  const dadJokeApiClient = new DadJokeApiClient();
  const jokesById: Ref<JokeRecord> = ref({});
  const jokeImagesById: Ref<Record<string, Option<string>>> = ref({});
  const jokeSearchList: Ref<string[]> = ref([]);
  const currentPage = ref(1);
  const currentSearchTerm: Ref<string> = ref("");
  const isPrevSearchAtEnd: Ref<boolean> = ref(false);

  async function getSearchResults(params: JokeSearchParams): Promise<void> {
    const [error, data] = await dadJokeApiClient.search(params);
    if (error) {
      console.error(error);
      return;
    }

    if (data.current_page === 1) {
      currentPage.value = 1;
      currentSearchTerm.value = data.search_term;
      jokesById.value = {};
      jokeSearchList.value = [];
    }

    currentPage.value = data.current_page;
    isPrevSearchAtEnd.value = data.current_page === data.total_pages;

    data.results.forEach((joke) => {
      jokesById.value[joke.id] = Option.some(joke);
      jokeSearchList.value.push(joke.id);
    });
  }

  async function getMoreSearchResults(): Promise<void> {
    if (isPrevSearchAtEnd.value) {
      return;
    }
    const params: JokeSearchParams = {
      page: currentPage.value + 1,
      limit: 20,
      term: currentSearchTerm.value,
    };
    await getSearchResults(params); 
  }

  async function getRandomJoke(): Promise<string | undefined> {
    const [error, randomJoke] = await dadJokeApiClient.random();
    if (error) {
      console.error(error);
      return undefined;
    }

    jokesById.value[randomJoke.id] = Option.some(randomJoke);
    return randomJoke.id;
  }

  async function getJokeById(id: string): Promise<void> {
    if (jokesById.value[id]) {
      return;
    }
    const [error, joke] = await dadJokeApiClient.getJokeById(id);

    if (error) {
      console.error(error);
      jokesById.value[id] = Option.none();
      return;
    }

    jokesById.value[joke.id] = Option.some(joke);
  }

  async function getGeneratedJokeImage(id: string, refresh: boolean = false): Promise<void> {
    const joke = jokesById.value[id];
    if (!joke || joke.isNone) {
      return;
    }

    if (jokeImagesById.value[id] && !refresh) {
      return;
    }

    const localStorageKey = `joke-image-${id}`;
    const cachedImageUrl = localStorage.getItem(localStorageKey);

    if (cachedImageUrl && !refresh) {
      jokeImagesById.value[id] = Option.some(cachedImageUrl);
      return;
    }

    const [error, imageResponse] = await dalleImageApiClient.getGeneratedJokeImage(joke.some!.joke)
    if (error) {
      console.error(error);
      jokeImagesById.value[id] = Option.none();
      return;
    }

    localStorage.setItem(localStorageKey, imageResponse.url);
    jokeImagesById.value[id] = Option.some(imageResponse.url);
  }

  const searchList = computed(() =>
    jokeSearchList.value
      .filter((jokeId) => !jokesById.value[jokeId].isNone)
      .map((jokeId) => jokesById.value[jokeId].some!)
  );

  const jokes: JokesStore = {
    jokeImagesById,
    jokesById,
    jokeSearchList,
    isPrevSearchAtEnd,
    currentPage,
    currentSearchTerm,

    getJokeById,
    getRandomJoke,
    getSearchResults,
    getMoreSearchResults,
    getGeneratedJokeImage,

    searchList
  };
  return jokes;
});
