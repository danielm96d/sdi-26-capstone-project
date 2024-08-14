import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast({
                    title: "Login successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/dashboard');
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            toast({
                title: "Login failed",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit} maxWidth="400px" margin="auto">
            <Stack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input name="username" onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input name="password" type="password" onChange={handleChange} />
                </FormControl>
                <Button type="submit" colorScheme="blue" isLoading={loading}>
                    Login
                </Button>
            </Stack>
        </Box>
    );
}