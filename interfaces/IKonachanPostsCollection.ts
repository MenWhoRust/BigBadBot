export interface IKonachanPostsCollection {
    count: number;
    offset: number;
    post: IKonachanPost;
}
interface IKonachanPost {
    actual_preview_height: string;
    actual_preview_width: string;
    author: string;
    change: string;
    created_at: number;
    creator_id: string;
    file_size: string;
    file_url: string;
    frames: string;
    frames_pending: string;
    frames_pending_string: string;
    frames_string: string;
    has_children: string;
    height: string;
    id: string;
    is_held: string;
    is_shown_in_index: string;
    jpeg_file_size: string;
    jpeg_height: string;
    jpeg_url: string;
    jpeg_width: string;
    md5: string;
    preview_height: string;
    preview_url: string;
    preview_width: string;
    rating: string;
    sample_file_size: string;
    sample_height: string;
    sample_url: string;
    sample_width: string;
    score: string;
    source: string;
    status: string;
    tags: string;
    width: string;
    parent_id?: string;
}
