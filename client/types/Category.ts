export interface Category {
    categoryId: number;
    name: string;
    description?: string;
}

export interface CategoryUploadDTO {
    name: string;
    description?: string;
}
