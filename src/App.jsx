

import React, { useState, useEffect } from "react";
import { getProduct, postProduct, deleteProduct } from "./products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCat, setProductCat] = useState('');
  const [productImage, setProductImage] = useState(''); // string qilib o'zgartirdik
  const [error, setError] = useState(null);
  const [isCreate, setIsCreated] = useState(false)

  useEffect(() => {
    console.log('Triggerrr');
    
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://api.escuelajs.co/api/v1/products');
        const data = await res.json();

        // Agar images bo'sh bo'lsa fallback URL qo'yish
        const safeData = data.map(product => ({
          ...product,
          images: product.images?.length ? product.images : ["https://via.placeholder.com/150"]
        }));

        setProducts(safeData);
        setLoading(false);
      } catch (err) {
        setError("Ma'lumotni olishda xatolik");
        setLoading(false);
      }
    };
    fetchProducts();
    console.log(11111);

  }, [isCreate]);

  const createProduct = async () => {
    
    const product = {
      title: productName,
      price: Number(productPrice),
      images: [productImage],
      description: productDescription,
      categoryId: Number(productCat)// bu joyni real category id bilan almashtiring

    };
  
    await postProduct(product)
    setIsCreated(true)
      .then((newProduct) => {
        setProducts([newProduct, ...products]); // yangi productni qo‘shish
        setIsModalOpen(false);
      })
      .catch(err => console.log(err));
  }

  return (
    <>
    
      {isLoading && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Loading....</div>}
      {error && <div className="text-red-500">{error}</div>}

      <button onClick={() => setIsModalOpen(true)} className="border p-2 text-emerald-800">
        Open modal
      </button>

      <div className="p-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
   <div
  key={product.id}
className="relative border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300 overflow-hidden"
>
<button
  onClick={async () => {
    await deleteProduct(product.id);
    setProducts(products.filter(p => p.id !== product.id));
  }}
  className="absolute top-2 right-2 p-2 bg-red-200 text-red-700 rounded"
>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="m18.412 6.5l-.801 13.617A2 2 0 0 1 15.614 22H8.386a2 2 0 0 1-1.997-1.883L5.59 6.5H3.5v-1A.5.5 0 0 1 4 5h16a.5.5 0 0 1 .5.5v1z"
      />
    </svg>
  </button>

  <img
    src={product.images?.[0] || "https://via.placeholder.com/150"}
    alt={product.title}
    className="w-full h-48 object-cover mb-4 rounded"
  />

  <h2 className="text-sm font-semibold text-center mb-2">
    {product.title}
  </h2>

  <p className="text-2xl text-emerald-700">
    {product.price}
  </p>
</div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-150 border h-100 p-4 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-center text-2xl">Create product</p>
            <button onClick={() => setIsModalOpen(false)} className="border h-8 w-8">
              X
            </button>
          </div>

          <input
            onChange={(e) => setProductName(e.target.value)}
            className="border w-1/2 my-2"
            placeholder="Product name"
            type="text"
          />
          <input
            onChange={(e) => setProductDescription(e.target.value)}
            className="border w-1/2 my-2"
            placeholder="Description"
            type="text"
          />
          <input
            onChange={(e) => setProductPrice(e.target.value)}
            className="border w-1/2 my-2"
            placeholder="Price"
            type="text"
          />
          <input
            onChange={(e) => setProductCat(e.target.value)}
            className="border w-1/2 my-2"
            placeholder="Category"
            type="text"
          />
          <input
            onChange={(e) => setProductImage(e.target.value)}
            className="border w-1/2 my-2"
            placeholder="Image url"
            type="text"
          />

          <div className="flex text-center justify-center bg-green-500 max-w-25 p-2 text-white">
            <button onClick={createProduct}>Create</button>
          </div>
        </div>
      )}
    </>
  );
}