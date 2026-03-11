export interface Review {
  id: string;
  author: { id: string; name: string };
  rating: number;
  comment: string | null;
  reviewedAt: string;
}

export interface RatingInfo {
  average: number;
  count: number;
}