import axios, { type Axios } from "axios";
import { type ApiResult } from "./common/ApiResult";

export type GeneratedImageUrlResponse = {
    url: string;   
}
export default class DalleImageApiClient {
    static BASE_URL: string = "/api/v1";
    readonly axios: Axios;
  
    constructor() {
      this.axios = axios.create({
        baseURL: DalleImageApiClient.BASE_URL,
        headers: {
          Accept: "application/json",
        },
      });
    }

    async getGeneratedJokeImage(jokeText: string): Promise<ApiResult<GeneratedImageUrlResponse>> {
        try {
            const urlParams = new URLSearchParams({ joke: jokeText } as Record<string, string>);
            const url = `/dalle-image?${urlParams.toString()}`;
            const result = await this.axios.get(url);
            return [null, result.data];
        } catch (e: any) {
            return [e as Error];
        }
    }
}