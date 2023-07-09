import { expect, describe, it, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import DadJokeApiClient from "@/lib/DadJokeApiClient";
import DalleImageApiClient from "@/lib/DalleImageApiClient";
import { useJokesStore } from "@/stores/jokes";
import Option from "@/lib/common/Option";

vi.mock("@/lib/DadJokeApiClient", () => {
  const dadJokeClient = vi.fn();
  dadJokeClient.search = vi.fn();
  dadJokeClient.random = vi.fn();
  dadJokeClient.getJokeById = vi.fn();
  return {
    default: function () {
      return dadJokeClient;
    },
  };
});

vi.mock("@/lib/DalleImageApiClient", () => {
  const dalleImageClient = vi.fn();
  dalleImageClient.getGeneratedJokeImage = vi.fn();
  return {
    default: function () {
      return dalleImageClient;
    },
  };
});

describe("jokes pinia store", () => {
  let dadJokeClient, dalleImageClient;
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
    window.localStorage.clear();
    dadJokeClient = new DadJokeApiClient();
    dalleImageClient = new DalleImageApiClient();
  });

  describe("getSearchResults", () => {
    it("appends jokes to the list when page is >1", async () => {
      dadJokeClient.search.mockImplementationOnce(() => [
        null,
        {
          current_page: 2,
          limit: 20,
          next_page: 3,
          search_term: "",
          total_jokes: 700,
          total_pages: 100,
          results: [{ id: "1", joke: "test" }],
        },
      ]);

      const jokes = useJokesStore();
      jokes.$patch({
        jokeSearchList: ["2"],
        jokesById: { 2: Option.some({ id: "2", joke: "test" }) },
      });

      await jokes.getSearchResults({ page: 2 });
      expect(jokes.jokeSearchList).toStrictEqual(["2", "1"]);
      expect(jokes.currentSearchTerm).toBe("");
      expect(jokes.jokesById).toStrictEqual({
        2: Option.some({ id: "2", joke: "test" }),
        1: Option.some({ id: "1", joke: "test" }),
      });
      expect(jokes.isPrevSearchAtEnd).toBe(false);
    });

    it("resets the list when page is 1", async () => {
      dadJokeClient.search.mockImplementationOnce(() => [
        null,
        {
          current_page: 1,
          limit: 20,
          next_page: 3,
          search_term: "",
          total_jokes: 700,
          total_pages: 100,
          results: [{ id: "1", joke: "test" }],
        },
      ]);

      const jokes = useJokesStore();
      jokes.$patch({
        jokeSearchList: ["2"],
        jokesById: { 
          2: Option.some({ id: "2", joke: "test" }),
        },
        currentPage: 2,
      });

      await jokes.getSearchResults({ page: 1 });
      expect(jokes.jokeSearchList).toStrictEqual(["1"]);
      expect(jokes.jokesById).toStrictEqual({ 1: Option.some({ id: "1", joke: "test" }) });
      expect(jokes.isPrevSearchAtEnd).toBe(false);
      expect(jokes.currentPage).toBe(1);
      expect(jokes.currentSearchTerm).toBe("");
    });

    it("tracks if we are at the end of the search results", async () => {
      dadJokeClient.search.mockImplementationOnce(() => [
        null,
        {
          current_page: 1,
          limit: 20,
          next_page: 3,
          search_term: "",
          total_jokes: 1,
          total_pages: 1,
          results: [{ id: "1", joke: "test" }],
        },
      ]);

      const jokes = useJokesStore();

      await jokes.getSearchResults({ page: 1 });
      expect(jokes.isPrevSearchAtEnd).toBe(true);
    });
  });

  describe("getMoreSearchResults", () => {
    it ('skips load more search results if we are at the end', async () => {
      const jokes = useJokesStore();
      jokes.$patch({ isPrevSearchAtEnd: true });
      await jokes.getMoreSearchResults();
      expect(dadJokeClient.search).not.toHaveBeenCalled();
    });

    it("loads more search results based on last search", async () => {
      dadJokeClient.search.mockImplementationOnce(() => [
        null,
        {
          current_page: 2,
          limit: 20,
          next_page: 3,
          search_term: "Bonanza",
          total_jokes: 700,
          total_pages: 100,
          results: [{ id: "1", joke: "test" }],
        },
      ]);

      const jokes = useJokesStore();
      jokes.$patch({
        currentSearchTerm: "Bonanza",
        currentPage: 1,
        jokeSearchList: ["2"],
        jokesById: { 2: Option.some({ id: "2", joke: "test" }) },
      });

      await jokes.getMoreSearchResults();
      expect(dadJokeClient.search).toHaveBeenCalledWith({ page: 2, term: "Bonanza", limit: 20 });
      expect(jokes.jokeSearchList).toStrictEqual(["2", "1"]);
      expect(jokes.jokesById).toStrictEqual({
        2: Option.some({ id: "2", joke: "test" }),
        1: Option.some({ id: "1", joke: "test" }),
      });
      expect(jokes.isPrevSearchAtEnd).toBe(false);
    });
  });

  it("handles the getRandomJoke action", async () => {
    dadJokeClient.random.mockImplementationOnce(() => [
      null,
      {
        id: "1",
        joke: "test",
      },
    ]);

    const jokes = useJokesStore();
    const randomJokeId = await jokes.getRandomJoke();
    expect(jokes.jokesById).toStrictEqual({ 1: Option.some({ id: "1", joke: "test" }) });
    expect(jokes.jokeSearchList).toStrictEqual([]);
    expect(randomJokeId).toBe("1");
  });

  describe("getJokeById", () => {
    it("handles the getJokeById action", async () => {
      dadJokeClient.getJokeById.mockImplementationOnce(() => [
        null,
        {
          id: "1",
          joke: "test",
        },
      ]);

      const jokes = useJokesStore();
      await jokes.getJokeById("1");
      expect(jokes.jokesById).toStrictEqual({ 1: Option.some({ id: "1", joke: "test" }) });
      expect(jokes.jokeSearchList).toStrictEqual([]);
    });

    it("handles the getJokeById error", async () => {
      dadJokeClient.getJokeById.mockImplementationOnce(() => [new Error("NotFound")]);

      const jokes = useJokesStore();
      await jokes.getJokeById("1");
      expect(jokes.jokesById).toStrictEqual({ 1: Option.none() });
      expect(jokes.jokeSearchList).toStrictEqual([]);
    });

    it ('skips fetch if joke is already in store', async () => {
      const jokes = useJokesStore();
      const jokesById = { 1: Option.some({ id: "1", joke: "test" }) };
      jokes.$patch({
        jokesById,
      });
      await jokes.getJokeById("1");
  
      expect(jokes.jokesById).toStrictEqual(jokesById); 
    });
  });

  describe('getGeneratedJokeImage', () => {
    it('handles the getGeneratedJokeImage action', async () => {
      dalleImageClient.getGeneratedJokeImage.mockImplementationOnce(() => [
        null,
        { url: "https://test.com/test.png" },
      ]);

      const jokes = useJokesStore();
      jokes.$patch({
        jokesById: { 1: Option.some({ id: "1", joke: "test" }) },
      });

      await jokes.getGeneratedJokeImage('1');

      expect(jokes.jokeImagesById).toStrictEqual({
        1: Option.some("https://test.com/test.png"),
      });
      expect(localStorage.getItem("joke-image-1")).toBe("https://test.com/test.png");
    });
    
    it('skips if image is already in store', async () => {
      const jokes = useJokesStore();
      const jokeImagesById = { 1: Option.some("https://test.com/test.png"), 2: Option.none() };
      jokes.$patch({
        jokeImagesById,
        jokesById: { 1: Option.some({ id: "1", joke: "test" }), 2: Option.some({ id: "2", joke: "test" }) },
      });
      await jokes.getGeneratedJokeImage("1");
      await jokes.getGeneratedJokeImage("2");
 
      expect(jokes.jokeImagesById).toStrictEqual(jokeImagesById); 
      expect(dalleImageClient.getGeneratedJokeImage).not.toHaveBeenCalled();
    });

    it('handles the getGeneratedJokeImage error', async () => {
      dalleImageClient.getGeneratedJokeImage.mockImplementationOnce(() => [
        new Error("Bad"),
      ]);

      const jokes = useJokesStore();
      jokes.$patch({
        jokesById: { 1: Option.some({ id: "1", joke: "test" }) },
      });
      await jokes.getGeneratedJokeImage('1');

      expect(jokes.jokeImagesById).toStrictEqual({
        1: Option.none(),
      });
    });

    it('skips if joke is cached in localstorage, but hydrates store', async () => {
      const jokes = useJokesStore();
      localStorage.setItem("joke-image-1", "https://test.com/test.png");

      jokes.$patch({
        jokesById: { 1: Option.some({ id: "1", joke: "test" }) },
      });
      await jokes.getGeneratedJokeImage('1');

      expect(jokes.jokeImagesById).toStrictEqual({
        1: Option.some("https://test.com/test.png"),
      });
      expect(dalleImageClient.getGeneratedJokeImage).not.toHaveBeenCalled();
    });
  });

  it("handles the searchList computed", () => {
    const jokes = useJokesStore();
    jokes.$patch({
      jokeSearchList: ["2", "1"],
      jokesById: { 1: Option.none(), 2: Option.some({ id: "2", joke: "test" }) },
    });

    expect(jokes.searchList).toStrictEqual([{ id: "2", joke: "test" }]);
  });
});
