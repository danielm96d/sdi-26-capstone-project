import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Stack, Box, Button, Center, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Login() {
    const [invalid, setInvalid] = useState(false);
    const [login, setLogin] = useState({ username: "", password: "" })
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({});
    const toast = useToast();

    useEffect(() => {
        if(!response.success && Object.keys(response).length > 1) {
            toast({
                title: response.title,
                description: response.description,
                duration: 5000,
                status: response.status,
                isClosable: true,
                position: "bottom-right"
            })
        }
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
            <Box margin="0 auto" maxW="30%">
                <Stack spacing={10}>
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
                </Stack>
            </Box>
        </>
    )
}