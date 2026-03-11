export interface Groomer {
  id: string;
  shopName: string;
  address: string;
  bio: string | null;
  avatarUrl: string | null;
  user: {
    id: string;
    name: string;
  };
}