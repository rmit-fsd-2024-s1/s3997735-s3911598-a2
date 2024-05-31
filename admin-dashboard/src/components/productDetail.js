import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Form, Button, Spinner, Container, Alert } from 'react-bootstrap';

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
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

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
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

const ProductDetail = () => {
    const { id } = useParams();
    const { data, loading, error } = useQuery(GET_PRODUCT, { variables: { id } });
    const [updateProduct] = useMutation(UPDATE_PRODUCT);
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        category: 'standard',
        originalPrice: 0,
        validFrom: '',
        validTo: ''
    });
    const [errors, setErrors] = useState({});
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (data) {
            setProduct(data.product);
        }
    }, [data]);

    const validate = () => {
        const errors = {};
        if (!product.name) errors.name = 'Product name is required';
        if (!product.description) errors.description = 'Description is required';
        if (product.price <= 0) errors.price = 'Price must be greater than zero';
        if (product.category === 'special') {
            if (!product.validFrom) errors.validFrom = 'Valid From date is required for special products';
            if (!product.validTo) errors.validTo = 'Valid To date is required for special products';
        }
        return errors;
    };

    const handleUpdateProduct = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        
        const { __typename, id, ...cleanedProduct } = product;

        console.log("Updating product with id:", id); // 调试用
        console.log("Product input:", cleanedProduct); // 调试用

        updateProduct({ variables: { id, input: cleanedProduct } })
            .then(() => {
                setUpdateSuccess(true);
                setUpdateError(null);
            })
            .catch(err => {
                setUpdateError(err.message);
                setUpdateSuccess(false);
            });
    };



    if (loading) return <Spinner animation="border" />;
    if (error) return <p className="text-danger">Error: {error.message}</p>;

    return (
        <Container>
            <h2 className="mb-4">Edit Product</h2>
            {updateError && <Alert variant="danger">{updateError}</Alert>}
            {updateSuccess && <Alert variant="success">Product updated successfully</Alert>}
            <Form>
                <Form.Group controlId="formName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.description}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                        isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.price}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        as="select"
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    >
                        <option value="standard">Standard</option>
                        <option value="special">Special</option>
                    </Form.Control>
                </Form.Group>

                {product.category === 'special' && (
                    <>
                        <Form.Group controlId="formValidFrom">
                            <Form.Label>Valid From</Form.Label>
                            <Form.Control
                                type="date"
                                value={product.validFrom}
                                onChange={(e) => setProduct({ ...product, validFrom: e.target.value })}
                                isInvalid={!!errors.validFrom}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.validFrom}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formValidTo">
                            <Form.Label>Valid To</Form.Label>
                            <Form.Control
                                type="date"
                                value={product.validTo}
                                onChange={(e) => setProduct({ ...product, validTo: e.target.value })}
                                isInvalid={!!errors.validTo}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.validTo}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </>
                )}

                <Button variant="primary" onClick={handleUpdateProduct}>Update Product</Button>
            </Form>
        </Container>
    );
};

export default ProductDetail;
