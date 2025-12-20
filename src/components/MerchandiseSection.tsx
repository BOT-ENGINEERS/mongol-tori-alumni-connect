import { ShoppingBag, ShoppingCart, Tag } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isDigital: boolean;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: "1",
    name: "Mongol-Tori Team T-Shirt",
    description: "Official team t-shirt with embroidered logo. 100% premium cotton.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Apparel",
    isDigital: false,
    inStock: true,
  },
  {
    id: "2",
    name: "Rover Model Kit",
    description: "Build your own mini rover! Perfect for enthusiasts and collectors.",
    price: 3500,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=400&fit=crop",
    category: "Collectibles",
    isDigital: false,
    inStock: true,
  },
  {
    id: "3",
    name: "Team Hoodie",
    description: "Premium quality hoodie with Mongol-Tori branding. Perfect for winter.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    category: "Apparel",
    isDigital: false,
    inStock: true,
  },
  {
    id: "4",
    name: "Digital Certificate",
    description: "Exclusive supporter certificate with your name. NFT available.",
    price: 500,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    category: "Digital",
    isDigital: true,
    inStock: true,
  },
];

const MerchandiseSection = () => {
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (productId: string) => {
    setCart([...cart, productId]);
  };

  return (
    <section id="shop" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-3">
              <ShoppingBag size={16} />
              Support the Team
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground">
              Official <span className="text-gradient">Merchandise</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Show your support with exclusive Mongol-Tori merchandise
            </p>
          </div>
          <button className="btn-outline px-6 py-3 rounded-xl flex items-center gap-2 relative">
            <ShoppingCart size={18} />
            View Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="card-elevated card-orange-hover overflow-hidden group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-56 overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-foreground text-background px-2 py-1 rounded-full text-xs font-bold">
                    {product.category}
                  </span>
                  {product.isDigital && (
                    <span className="badge-primary text-xs">Digital</span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Tag size={14} className="text-primary" />
                    <span className="font-black text-xl text-foreground">৳{product.price}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="btn-primary px-4 py-2 rounded-lg text-sm"
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Info */}
        <div className="mt-12 card-elevated p-6 md:p-8 text-center">
          <p className="text-muted-foreground mb-4">
            We accept all major payment methods including bKash, Nagad, and Credit/Debit cards
          </p>
          <div className="flex items-center justify-center gap-4 opacity-50">
            <span className="text-2xl font-bold">bKash</span>
            <span className="text-2xl font-bold">Nagad</span>
            <span className="text-2xl font-bold">VISA</span>
            <span className="text-2xl font-bold">MC</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchandiseSection;