import axios, { type Axios } from "axios";
import { type ApiResult } from "./common/ApiResult";

export type JokeSearchParams = {
  page?: number;
  limit?: number;
  term?: string;
};

export type JokeResponse = {
  id: string;
  joke: string;
};

export type JokeSearchResponse = {
  current_page: number;
  limit: number;
  next_page: number;
  previous_page: number;
  search_term: string;
  total_jokes: number;
  total_pages: number;
  results: JokeResponse[];
};
export default class DadJokeClient {
  static BASE_URL: string = "https://icanhazdadjoke.com/";
  readonly axios: Axios;

  constructor() {
    this.axios = axios.create({
      baseURL: DadJokeClient.BASE_URL,
      headers: {
        Accept: "application/json",
      },
    });
  }

  async request<T>(url: string): Promise<ApiResult<T>> {
    try {
      const result = await this.axios.get(url);
      if (result.data.status === 404) {
        throw new Error("Not Found");
      }
      return [null, result.data];
    } catch (e: any) {
      return [e as Error];
    }
  }

  async search(
    params: JokeSearchParams = { page: 1, limit: 20 }
  ): Promise<ApiResult<JokeSearchResponse>> {
    const urlParams = new URLSearchParams({
      page: params.page ?? '1',
      limit: params.limit ?? '20',
      term: params.term ?? "",
    } as Record<string, string>);
    const url = `/search?${urlParams.toString()}`;
    return await this.request(url);
  }

  async random(): Promise<ApiResult<JokeResponse>> {
    return await this.request("/");
  }

  async getJokeById(id: string): Promise<ApiResult<JokeResponse>> {
    const url = `/j/${id}`;
    return await this.request(url);
  }
}
