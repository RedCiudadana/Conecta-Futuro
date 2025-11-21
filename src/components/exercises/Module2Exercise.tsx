import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

interface Module2ExerciseProps {
  onComplete: (data: Record<string, string>) => void;
  isCompleted?: boolean;
  savedData?: Record<string, string>;
}

export const Module2Exercise: React.FC<Module2ExerciseProps> = ({
  onComplete,
  isCompleted,
  savedData
}) => {
  const [products, setProducts] = useState<Product[]>(() => {
    if (savedData?.products) {
      try {
        return JSON.parse(savedData.products);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [currentProduct, setCurrentProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: '',
    description: '',
    imageUrl: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const validateProduct = () => {
    return (
      currentProduct.name.length >= 3 &&
      currentProduct.price.length > 0 &&
      currentProduct.description.length >= 20 &&
      currentProduct.imageUrl.length > 0
    );
  };

  const addProduct = () => {
    if (validateProduct()) {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...currentProduct
      };
      setProducts([...products, newProduct]);
      setCurrentProduct({ name: '', price: '', description: '', imageUrl: '' });
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleComplete = () => {
    if (products.length >= 3) {
      onComplete({ products: JSON.stringify(products) });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    setProducts([]);
    setCurrentProduct({ name: '', price: '', description: '', imageUrl: '' });
  };

  const formatPrice = (value: string) => {
    const numbers = value.replace(/[^\d.]/g, '');
    return numbers ? `Q ${numbers}` : '';
  };

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
      <div className="mb-6">
        <h4 className="font-semibold text-green-900 mb-2 flex items-center text-lg">
          <Sparkles className="w-5 h-5 mr-2" />
          ✏️ Ejercicio Práctico: Crear catálogo en WhatsApp Business
        </h4>
        <p className="text-green-800 mb-4">
          Crea un catálogo con al menos 3 productos para tu negocio. Incluye nombre, precio, descripción e imagen de cada uno.
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-green-700">
            <span>Productos agregados</span>
            <span className="font-medium">{products.length} / 3 (mínimo)</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((products.length / 3) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {isCompleted ? (
        <div className="bg-white rounded-lg p-6 border-2 border-green-500">
          <div className="flex items-center gap-3 text-green-700 mb-4">
            <CheckCircle className="w-8 h-8" />
            <div>
              <h5 className="font-semibold text-lg">¡Ejercicio Completado! 🎉</h5>
              <p className="text-sm">Has creado tu catálogo exitosamente con {products.length} productos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {products.map(product => (
              <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  )}
                </div>
                <h6 className="font-semibold text-gray-900 mb-1">{product.name}</h6>
                <p className="text-green-600 font-bold mb-2">{product.price}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Volver a intentar para practicar →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-4">Agregar Producto al Catálogo</h5>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  placeholder="Ej: Pastel de chocolate"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  maxLength={50}
                />
                <p className="text-sm text-gray-500 mt-1">{currentProduct.name.length} / 50</p>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Precio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: formatPrice(e.target.value) })}
                  placeholder="Q 150.00"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  placeholder="Describe tu producto: ingredientes, tamaño, características..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 min-h-[100px] resize-none"
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">{currentProduct.description.length} / 200 (mínimo 20)</p>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  URL de Imagen <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={currentProduct.imageUrl}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
                <p className="text-sm text-gray-500 mt-1">Puedes usar imágenes de Pexels o tu propia URL</p>
              </div>

              <button
                onClick={addProduct}
                disabled={!validateProduct()}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  validateProduct()
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="w-5 h-5" />
                Agregar Producto
              </button>
            </div>
          </div>

          {products.length > 0 && (
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
              <h5 className="font-semibold text-gray-900 mb-4">Productos en tu Catálogo ({products.length})</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <h6 className="font-semibold text-gray-900 mb-1">{product.name}</h6>
                    <p className="text-green-600 font-bold mb-2">{product.price}</p>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleComplete}
              disabled={products.length < 3}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                products.length >= 3
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {products.length >= 3 ? '✅ Completar Ejercicio' : `⏳ Agrega ${3 - products.length} producto(s) más`}
            </button>
            {products.length > 0 && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg p-8 max-w-md shadow-2xl transform animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Excelente trabajo!</h3>
              <p className="text-gray-600 mb-4">
                Has creado tu catálogo de productos con {products.length} artículos.
              </p>
              <p className="text-sm text-primary-600 font-medium">
                ¡Tu negocio se ve muy profesional! 🌟
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
