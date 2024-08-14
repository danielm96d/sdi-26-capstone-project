import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Button, Select, useToast } from '@chakra-ui/react';
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        rank: "",
        isApprover: false
    });
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const ranks = [
        ...Array.from({ length: 9 }, (_, i) => `E-${i + 1}`),
        ...Array.from({ length: 5 }, (_, i) => `W-${i + 1}`),
        ...Array.from({ length: 10 }, (_, i) => `O-${i + 1}`)
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    name: formData.name,
                    rank: formData.rank,
                    isApprover: formData.isApprover === 'true'
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast({
                    title: "Registration successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/login');
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            toast({
                title: "Registration failed",
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
                <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input name="confirmPassword" type="password" onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input name="name" onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Rank</FormLabel>
                    <AutoComplete>
                        <AutoCompleteInput name="rank" onChange={handleChange} />
                        <AutoCompleteList>
                            {ranks.map((rank, index) => (
                                <AutoCompleteItem key={index} value={rank} />
                            ))}
                        </AutoCompleteList>
                    </AutoComplete>
                </FormControl>
                <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select name="isApprover" onChange={handleChange}>
                        <option value="false">User</option>
                        <option value="true">Approver</option>
                    </Select>
                </FormControl>
                <Button type="submit" colorScheme="blue" isLoading={loading}>
                    Register
                </Button>
            </Stack>
        </Box>
    );
}