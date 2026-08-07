// Mock catalog ported from the mockup's `const products = [...]` array, typed.
// Step 3 (real catalog) replaces this with data fetched from the Spring Boot API -
// this file exists purely so steps 2 (home) and this one's components have something
// real-shaped to render against before that wiring exists.
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  bestseller: boolean;
  isNew: boolean;
  inStock: boolean;
}

export const products: Product[] = [
  { id: 1, name: "Máquina Rotativa Pro X", brand: "Cheyenne", category: "Máquinas", price: 1890, oldPrice: 2190, rating: 4.8, reviews: 132, bestseller: true, isNew: false, inStock: true },
  { id: 2, name: "Kit Agulhas Round Liner 0.30mm (50un)", brand: "Kwadron", category: "Agulhas", price: 129, oldPrice: null, rating: 4.6, reviews: 210, bestseller: true, isNew: false, inStock: true },
  { id: 3, name: "Tinta Preta Fineline 30ml", brand: "Dynamic Ink", category: "Tintas", price: 89, oldPrice: null, rating: 4.9, reviews: 340, bestseller: true, isNew: false, inStock: true },
  { id: 4, name: "Kit Descartáveis Completo (100pç)", brand: "Electric Ink", category: "Descartáveis", price: 159, oldPrice: 190, rating: 4.5, reviews: 88, bestseller: false, isNew: true, inStock: true },
  { id: 5, name: "Pomada Cicatrizante Pós-Tattoo", brand: "Eternal Ink", category: "Cuidados pós-tattoo", price: 59, oldPrice: null, rating: 4.7, reviews: 150, bestseller: true, isNew: false, inStock: true },
  { id: 6, name: "Fonte Digital Wireless", brand: "Cheyenne", category: "Acessórios", price: 990, oldPrice: null, rating: 4.4, reviews: 47, bestseller: false, isNew: true, inStock: false },
  { id: 7, name: "Agulhas Magnum 0.35mm (50un)", brand: "Kwadron", category: "Agulhas", price: 139, oldPrice: null, rating: 4.6, reviews: 98, bestseller: false, isNew: false, inStock: true },
  { id: 8, name: "Tinta Colorida Set 12 Cores", brand: "Eternal Ink", category: "Tintas", price: 349, oldPrice: 399, rating: 4.8, reviews: 176, bestseller: true, isNew: false, inStock: true },
  { id: 9, name: "Máquina Bobina Clássica", brand: "Bishop Rotary", category: "Máquinas", price: 780, oldPrice: null, rating: 4.3, reviews: 64, bestseller: false, isNew: false, inStock: true },
  { id: 10, name: "Grip Descartável 25mm (20un)", brand: "Electric Ink", category: "Descartáveis", price: 75, oldPrice: null, rating: 4.5, reviews: 112, bestseller: false, isNew: false, inStock: true },
  { id: 11, name: "Filme Protetor Pós-Tattoo (5un)", brand: "Dynamic Ink", category: "Cuidados pós-tattoo", price: 99, oldPrice: null, rating: 4.6, reviews: 201, bestseller: true, isNew: false, inStock: true },
  { id: 12, name: "Maleta Organizadora Profissional", brand: "Bishop Rotary", category: "Acessórios", price: 420, oldPrice: 480, rating: 4.7, reviews: 53, bestseller: false, isNew: true, inStock: true },
];
