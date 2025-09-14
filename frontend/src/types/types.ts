export type Tag = {
    name: string;
    confidence: number;
};

export type Photo = {
    id: string;
    s3Url: string;
    dateModified: string;
    tags: Tag[];
    userId: string;
    thumbnail_url?: string;
    filename?: string;
};

export type LLMResponse = {
    success: boolean;
    query: string;
    results: string;
}
