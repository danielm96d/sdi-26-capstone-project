import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Stack, Box, Button, Center } from "@chakra-ui/react";
import { useState } from "react";

export default function Login() {
    const [invalid, setInvalid] = useState(false);
    const [login, setLogin] = useState({ username: "", password: "" })


    const handleChange = (e) => {
        if (e.target.id === "username") {
            setLogin({ ...login, username: e.target.value })
        } else if (e.target.id === "password") {
            setLogin({ ...login, password: e.target.value })
        }
    }

    const submitLogin = () => {
        console.log("Logging in", login)
        if (login.username.length < 1 || login.password.length < 1) {
            setInvalid(true)
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
                        <Button onClick={submitLogin}>Login</Button>
                    </Center>
                </Stack>
            </Box>
        </>
    )
}