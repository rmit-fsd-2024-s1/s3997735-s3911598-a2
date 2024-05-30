import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Form, Button, ListGroup, ListGroupItem, Spinner, Container } from 'react-bootstrap';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      category
      originalPrice
      imageUrl
      validFrom
      validTo
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct($input: ProductInput!) {
    addProduct(input: $input) {
      id
      name
      description
      price
      category
      originalPrice
      imageUrl
      validForm
      validTo
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      price
      category
      originalPrice
      imageUrl
      validForm
      validTo
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
    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        description:'',
        price: 0, 
        category: 'standard',
        originalPrice:0,
        imageUrl:'',
        validForm:'',
        validTo:''
    });

    if (loading) return <Spinner animation="border" />;
    if (error) return <p className="text-danger">Error: {error.message}</p>;

    const handleAddProduct = () => {
        addProduct({ variables: { input: newProduct } });
        setNewProduct({
            name: '',
            description: '',
            price: 0,
            category: 'standard',
            originalPrice: 0,
            imageUrl: '',
            validFrom: '',
            validTo: ''
        });
    };

    const handleUpdateProduct = (id, name, description, price, category, originalPrice, imageUrl, validFrom, validTo) => {
        updateProduct({ variables: { id, input: { name, description, price, category, originalPrice, imageUrl, validFrom, validTo } } });
    };

    const handleDeleteProduct = (id) => {
        deleteProduct({ variables: { id } });
    };

    return (
        <Container>
            <h2 className="mb-4">Product Management</h2>
            <Form className="mb-4">
                <Form.Group>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Product Name"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Description"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        placeholder="Product Price"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        as="select"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                        <option value="standard">Standard</option>
                        <option value="special">Special</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Original Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: parseFloat(e.target.value) })}
                        placeholder="Original Price"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        placeholder="Image URL"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Valid From</Form.Label>
                    <Form.Control
                        type="text"
                        value={newProduct.validFrom}
                        onChange={(e) => setNewProduct({ ...newProduct, validFrom: e.target.value })}
                        placeholder="Valid From"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Valid To</Form.Label>
                    <Form.Control
                        type="text"
                        value={newProduct.validTo}
                        onChange={(e) => setNewProduct({ ...newProduct, validTo: e.target.value })}
                        placeholder="Valid To"
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleAddProduct}>Add Product</Button>
            </Form>
            <ListGroup>
                {data.products.map((product) => (
                    <ListGroupItem key={product.id} className="d-flex justify-content-between align-items-center">
                        <span>{product.name} - ${product.price} - {product.category}</span>
                        <div>
                            <Button
                                variant="info"
                                className="mr-2"
                                onClick={() => handleUpdateProduct(product.id, product.name, product.description, product.price, product.category, product.originalPrice, product.imageUrl, product.validFrom, product.validTo)}
                            >
                                Update
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                        </div>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </Container>
    );
};

export default ProductManagement;
