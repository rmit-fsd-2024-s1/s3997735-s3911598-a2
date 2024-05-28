import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      isSpecial
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $price: Float!, $isSpecial: Boolean!) {
    addProduct(name: $name, price: $price, isSpecial: $isSpecial) {
      id
      name
      price
      isSpecial
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String, $price: Float, $isSpecial: Boolean) {
    updateProduct(id: $id, name: $name, price: $price, isSpecial: $isSpecial) {
      id
      name
      price
      isSpecial
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

const ProductManagement = () => {
    const { data, loading, error } = useQuery(GET_PRODUCTS);
    const [addProduct] = useMutation(ADD_PRODUCT);
    const [updateProduct] = useMutation(UPDATE_PRODUCT);
    const [deleteProduct] = useMutation(DELETE_PRODUCT);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0, isSpecial: false });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleAddProduct = () => {
        addProduct({ variables: { ...newProduct } });
        setNewProduct({ name: '', price: 0, isSpecial: false });
    };

    const handleUpdateProduct = (id, name, price, isSpecial) => {
        updateProduct({ variables: { id, name, price, isSpecial } });
    };

    const handleDeleteProduct = (id) => {
        deleteProduct({ variables: { id } });
    };

    return (
        <div>
            <h2>Product Management</h2>
            <div>
                <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Product Name"
                />
                <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    placeholder="Product Price"
                />
                <label>
                    Special:
                    <input
                        type="checkbox"
                        checked={newProduct.isSpecial}
                        onChange={(e) => setNewProduct({ ...newProduct, isSpecial: e.target.checked })}
                    />
                </label>
                <button onClick={handleAddProduct}>Add Product</button>
            </div>
            <ul>
                {data.products.map((product) => (
                    <li key={product.id}>
                        {product.name} - ${product.price} - {product.isSpecial ? 'Special' : 'Standard'}
                        <button onClick={() => handleUpdateProduct(product.id, product.name, product.price, !product.isSpecial)}>
                            Toggle Special
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductManagement;
