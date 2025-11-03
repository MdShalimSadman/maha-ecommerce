export interface Category {
  name: string;
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  sale?: number;
  sizes?: number[];
  imageUrl?: string;
  slug: {
    current: string;
  };
  category?: Category;
  description?: string;
}
