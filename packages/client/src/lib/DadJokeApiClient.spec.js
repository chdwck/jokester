import { expect, describe, it, vi, beforeEach } from "vitest";
import DadJokeApiClient from "@/lib/DadJokeApiClient";

const mockSearchRes = Promise.resolve({
    data: {
        current_page: 1,
        limit: 20,
        next_page: 2,
        search_term: "",
        total_jokes: 700,
        total_pages: 100,
        results: [{ id: "1", joke: "test" }],
    },
});

describe("DadJokeApiClient", () => {
    let client, mockGet;
    beforeEach(() => {
        vi.resetAllMocks();
        client = new DadJokeApiClient();
        mockGet = vi.spyOn(client.axios, "get");
    });

    describe("getSearchResults", () => {
        it("can correctly query search endpoint with defaults", async () => {
            mockGet.mockImplementationOnce(() => mockSearchRes);
    
            await client.search();
            expect(mockGet).toHaveBeenCalledWith("/search?page=1&limit=20&term=");
        });
    
        it("can correctly query search endpoint with defaults", async () => {
            mockGet.mockImplementationOnce(() => mockSearchRes);
    
            await client.search({ page: 2, limit: 30, term: "test" });
            expect(mockGet).toHaveBeenCalledWith("/search?page=2&limit=30&term=test")        
        });

        it("can correctly query search endpoint with partial defaults", async () => {
            mockGet.mockImplementationOnce(() => mockSearchRes);
    
            await client.search({ page: 2 });
            expect(mockGet).toHaveBeenCalledWith("/search?page=2&limit=20&term=")        
        }); 
    });

    it("can correctly query random endpoint", async () => {
        mockGet.mockImplementationOnce(() => ({ data: { id: "1", joke: "test" } }));
        await client.random();
        expect(mockGet).toHaveBeenCalledWith("/");
    });

    it("can correctly query details endpoint", async () => {
        mockGet.mockImplementationOnce(() => ({ data: { id: "1", joke: "test" } }));
        await client.getJokeById("1");
        expect(mockGet).toHaveBeenCalledWith("/j/1");
    });
});
