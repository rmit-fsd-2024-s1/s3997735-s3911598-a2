import React, { useState } from 'react';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import UserManagement from './components/userManagement';
import ProductManagement from './components/productManagement';
import ReviewModeration from './components/reviewModeration';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [value, setValue] = useState(0);

    const renderContent = () => {
        switch (value) {
            case 1:
                return <UserManagement />;
            case 2:
                return <ProductManagement />;
            case 3:
                return <ReviewModeration />;
            default:
                return (
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <h4 className="text-center" style={{ fontSize: '2em' }}>Welcome to admin</h4>
                        </Col>
                    </Row>
                );
        }
    };

    return (
        <Container>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Navbar.Brand href="#">Admin Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => setValue(1)}>User Management</Nav.Link>
                        <Nav.Link onClick={() => setValue(2)}>Product Management</Nav.Link>
                        <Nav.Link onClick={() => setValue(3)}>Review Moderation</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Container>
                {renderContent()}
            </Container>
        </Container>
    );
};

export default App;
