import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Stack, Box, Button, Center, useToast, Text, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {Helmet} from 'react-helmet'

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (!response.success && Object.keys(response).length > 1) {
            toast({
                title: response.title,
                description: response.description,
                duration: 5000,
                status: response.status,
                isClosable: true,
                position: "bottom-right"
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response])


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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(login)
            })
                .then(res => res.json())
                .then(json => setResponse(json))
                .catch(() => {
                    toast({
                        title: "Error!",
                        description: "We're sorry an unexpected error has occured!",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom-right"
                    })
                    setLoading(false)
                })
        }
    }

    return (
        <>
        <Helmet>
            <title>OpSync | Login</title>
        </Helmet>
            <Box margin="0 auto" maxW="30%">
                <Stack spacing={5}>
                    <FormControl id="username" onChange={handleChange} isInvalid={invalid && login.username.length < 1} isRequired={true}>
                        <FormLabel>Username</FormLabel>
                        <Input placeholder="@username" />
                        <FormHelperText>Enter the username you used to sign up!</FormHelperText>
                        <FormErrorMessage>A username is required to login!</FormErrorMessage>
                    </FormControl>
                    <FormControl id="password" onChange={handleChange} isInvalid={invalid && login.password.length < 1} isRequired={true}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder="password" />
                        <FormHelperText>Enter the password you used to sign up!</FormHelperText>
                        <FormErrorMessage>A password is required to login!</FormErrorMessage>
                    </FormControl>
                    <Center>
                        <Button isLoading={loading} onClick={submitLogin}>Login</Button>
                    </Center>
                    <Text textAlign="center">
                        Don&apos;t have an account?{' '}
                        <Link color='teal.500' href='/sign-up'>
                            sign up
                        </Link>
                    </Text>
                </Stack>
            </Box>
        </>
    )
}