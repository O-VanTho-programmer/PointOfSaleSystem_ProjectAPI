export interface Item {
    itemId: number;
    name: string;
    quantityInStock: number;
    price: number;
    imageUrl?: string;
    imagePublicId?: string;
    categoryId: number;
}

export interface ItemUploadDTO {
    name: string;
    isSoldOut: boolean;
    price: number;
    image?: File;
    categoryId: number;
}

export interface TemplateApi<T> {
    payload: T | null;
    listPayload: T[] | null;
    message: string;
    success: boolean;
    pageNumber: number;
    pageSize: number;
    totalElement: number;
    totalPages: number;
}
