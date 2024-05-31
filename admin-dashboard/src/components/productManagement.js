import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Form, Button, ListGroup, ListGroupItem, Spinner, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// GraphQL queries and mutations
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      category
      originalPrice
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
      validFrom
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
    const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);
    const [addProduct] = useMutation(ADD_PRODUCT);
    const [deleteProduct] = useMutation(DELETE_PRODUCT);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: 'standard',
        originalPrice: '',
        validFrom: '',
        validTo: ''
    });
    const [showAddSuccess, setShowAddSuccess] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    if (loading) return <Spinner animation="border" />;
    if (error) return <p className="text-danger">Error: {error.message}</p>;

    const validate = () => {
        console.log(newProduct);
        const errors = {};
        if (!newProduct.name) errors.name = 'Product name is required';
        if (!newProduct.description) errors.description = 'Description is required';
        if (newProduct.price === '' || isNaN(newProduct.price) || newProduct.price <= 0) errors.price = 'Price must be greater than zero and a valid number';
        if (newProduct.category === 'special') {
            if (!newProduct.validFrom) errors.validFrom = 'Valid From date is required for special products';
            if (!newProduct.validTo) errors.validTo = 'Valid To date is required for special products';
        }
        return errors;
    };

    const handleAddProduct = () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            console.log("error");
            setValidationErrors(errors);
            return;
        }
    
        
    //console.log(newProduct);
        const input = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
        };
        
        //console.log(input) //testing
        addProduct({ variables: { input } })
            .then(() => {
                setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    category: 'standard',
                    originalPrice: '',
                    validFrom: '',
                    validTo: ''
                });
                setShowAddSuccess(true);
                setValidationErrors({});
                setTimeout(() => setShowAddSuccess(false), 3000);
            })
            .catch(err => {
                setErrorMessage(err.message);
            });
    };

    const handleDeleteProduct = (id) => {
        if (!id) {
            setErrorMessage('Product ID is required for deletion.');
            return;
        }

        deleteProduct({ variables: { id } })
            .then(() => {
                setShowDeleteSuccess(true);
                refetch(); // Refresh the product list
                setTimeout(() => setShowDeleteSuccess(false), 3000);
                setErrorMessage('');
            })
            .catch(err => {
                setErrorMessage(err.message);
            });
    };

    return (
        <Container>
            <h2 className="mb-4">Product Management</h2>
            {showAddSuccess && <Alert variant="success">Product added successfully!</Alert>}
            {showDeleteSuccess && <Alert variant="success">Product deleted successfully!</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form className="mb-4">
                <Form.Group>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={newProduct.name}
                        isInvalid={!!validationErrors.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Product Name"
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.name}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        value={newProduct.description}
                        isInvalid={!!validationErrors.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Description"
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.description}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={newProduct.price}
                        isInvalid={!!validationErrors.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="Product Price"
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.price}
                    </Form.Control.Feedback>
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
                {newProduct.category === 'special' && (
                    <>
                        <Form.Group>
                            <Form.Label>Valid From</Form.Label>
                            <Form.Control
                                type="date"
                                value={newProduct.validFrom}
                                isInvalid={!!validationErrors.validFrom}
                                onChange={(e) => setNewProduct({ ...newProduct, validFrom: e.target.value })}
                                placeholder="Valid From"
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.validFrom}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Valid To</Form.Label>
                            <Form.Control
                                type="date"
                                value={newProduct.validTo}
                                isInvalid={!!validationErrors.validTo}
                                onChange={(e) => setNewProduct({ ...newProduct, validTo: e.target.value })}
                                placeholder="Valid To"
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.validTo}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </>
                )}
                <Form.Group>
                    <Form.Label>Original Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                        placeholder="Original Price"
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleAddProduct}>Add Product</Button>
            </Form>
            <ListGroup>
                {data.products.map((product) => (
                    <ListGroupItem key={product.id} className="d-flex justify-content-between align-items-center">
                        <span>{product.name} - ${product.price} - {product.category}</span>
                        <div>
                            <Button variant="info" className="mr-2" onClick={() => navigate(`/product/${product.id}`)}>Update</Button>
                            <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                        </div>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </Container>
    );
};

export default ProductManagement;
