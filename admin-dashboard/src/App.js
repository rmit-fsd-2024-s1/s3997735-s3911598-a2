import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import UserManagement from './components/userManagement';
import ProductManagement from './components/productManagement';
import ReviewModeration from './components/reviewModeration';
import ProductDetail from './components/productDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <Router>
            <Container>
                <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                    <Navbar.Brand href="#">Admin Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/user-management">User Management</Nav.Link>
                            <Nav.Link as={Link} to="/product-management">Product Management</Nav.Link>
                            <Nav.Link as={Link} to="/review-moderation">Review Moderation</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Container>
                    <Routes>
                        <Route path="/" element={
                            <Row className="justify-content-center">
                                <Col md={8}>
                                    <h4 className="text-center" style={{ fontSize: '4em' }}>Welcome to admin</h4>
                                </Col>
                            </Row>
                        } />
                        <Route path="/user-management" element={<UserManagement />} />
                        <Route path="/product-management" element={<ProductManagement />} />
                        <Route path="/review-moderation" element={<ReviewModeration />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                    </Routes>
                </Container>
            </Container>
        </Router>
    );
};

export default App;
