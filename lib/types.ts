export interface Book {
    id: string;
    user_id: string;
    title: string;
    author: string;
    status: 'Reading' | 'Completed' | 'Wishlist';
    created_at: string;
    updated_at: string;
}

export interface CreateBookDto {
    title: string;  
    author: string;
    status: 'Reading' | 'Completed' | 'Wishlist';
}