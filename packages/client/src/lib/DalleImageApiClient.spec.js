import { expect, describe, it, vi, beforeEach } from "vitest";
import DalleImageApiClient from "@/lib/DalleImageApiClient";

const mockImageRes = Promise.resolve({
    data: {
        url: "https://test.com/test.png",
    }
});
describe("DalleImageApiClient", () => {
    let client, mockGet;
    beforeEach(() => {
        vi.resetAllMocks();
        client = new DalleImageApiClient();
        mockGet = vi.spyOn(client.axios, "get");
    });

    it ('correctly querys for a generated image', async () => {
        mockGet.mockImplementationOnce(() => mockImageRes);
        await client.getGeneratedJokeImage("test");
        expect(mockGet).toHaveBeenCalledWith("/dalle-image?joke=test");
    });
})