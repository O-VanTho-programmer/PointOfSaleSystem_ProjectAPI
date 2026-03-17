export interface Item {
    itemId: number;
    name: string;
    quantityInStock: number;
    price: number;
    imageUrl?: string;
    categoryId: number;
}

/** Matches backend ItemsUploadDTO: Name, IsSoldOut, Price, ImageUrl?, CategoryId */
export interface ItemUploadDTO {
    name: string;
    isSoldOut: number;
    price: number;
    imageUrl?: string;
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
