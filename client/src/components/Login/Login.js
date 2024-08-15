import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Stack, Box, Button, Center, useToast, Text, Link, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet'

export default function Login() {
    const [invalid, setInvalid] = useState(false);
    const [login, setLogin] = useState({ username: "", password: "" })
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({});
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const toast = useToast();

    useEffect(() => {
        if (Object.keys(response).length > 1) {
            setLoading(false)
            toast({
                title: response.title,
                description: response.message,
                duration: 5000,
                status: response.status,
                isClosable: true,
                position: "bottom-right"
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response])


    const handleChange = (e) => {
        if (e.target.id === "username") {
            setLogin({ ...login, username: e.target.value })
        } else if (e.target.id === "password") {
            setLogin({ ...login, password: e.target.value })
        }
    }

    const submitLogin = () => {
        if (login.username.length < 1 || login.password.length < 1) {
            setInvalid(true)
        } else {
            setLoading(true)
            fetch('http://localhost:8080/login', {
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
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                            />
                            <InputRightElement width='4.5rem'>
                                <IconButton h='1.75rem' size='sm' isRound={true} icon={show ? <ViewOffIcon/> : <ViewIcon/>} onClick={handleClick}/>
                            </InputRightElement>
                        </InputGroup>
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