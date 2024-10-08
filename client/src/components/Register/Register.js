import {
    AutoComplete,
    AutoCompleteGroup,
    AutoCompleteGroupTitle,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { Box, Stack, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Center, Button, Select, Text, Link, useToast, InputGroup, InputRightElement, IconButton, useColorModeValue } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import {useNavigate} from 'react-router-dom';
export default function Register() {
    const [register, setRegister] = useState({ username: "", password: "", firstname: "", lastname: "", rank: "", isApprover: null });
    const [confrimPass, setConfirmPass] = useState("")
    const [invalid, setInvalid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({});
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const toast = useToast();
    const navigate = useNavigate();
    const contentColor = useColorModeValue("white", "gray.700");
    const ranks = {
        enlisted: Array.from({ length: 9 }, (v, i) => `E-${i + 1}`),
        warrant: Array.from({ length: 5 }, (v, i) => `W-${i + 1}`),
        officer: Array.from({ length: 10 }, (v, i) => `O-${i + 1}`),
    };

    useEffect(() => {
        if (Object.keys(result).length > 1) {
            setLoading(false)
            toast({
                title: result.title,
                description: result.message,
                duration: 5000,
                status: result.status,
                isClosable: true,
                position: "bottom-right"
            })
        }
        if (result.status === "success") {
            navigate("/")
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result])


    const handleChange = (e) => {
        switch (e.target.id) {
            case "username":
                setRegister({ ...register, username: e.target.value.toLowerCase() })
                break
            case "password":
                setRegister({ ...register, password: e.target.value })
                break
            case "passwordConfirm":
                setConfirmPass(e.target.value)
                break
            case "firstname":
                setRegister({ ...register, firstname: e.target.value })
                break
            case "lastname":
                setRegister({ ...register, lastname: e.target.value })
                break
            case "role":
                if (e.target.value === "") {
                    setRegister({ ...register, isApprover: null })
                    break
                } else {
                    setRegister({ ...register, isApprover: e.target.value === "approver" ? true : false })
                    break
                }
            default:
                break
        }
    }
    const handleAutocomplete = (e) => {
        setRegister({ ...register, rank: e.split('-').join('') })
    }

    const submitRegister = () => {
        if (register.username.length < 1 || register.password.length < 7 || register.password !== confrimPass || register.firstname.length < 1 || register.lastname.length < 1 || register.rank.length < 1 || register.role === "") {
            setInvalid(true)
        } else {
            setLoading(true)
            fetch('http://localhost:8080/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(register)
            })
                .then(res => res.json())
                .then(json => setResult(json))
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
            <title>OpSync | Sign Up</title>
        </Helmet>
            <Box margin="0 auto" maxW="30%" bgColor={contentColor} boxShadow="xl" p="6" marginY="-.5em">
                <Stack spacing={1}>
                    <FormControl id="username" onChange={handleChange} isInvalid={invalid && register.username.length < 1} isRequired={true}>
                        <FormLabel>Username</FormLabel>
                        <Input placeholder="@username" />
                        <FormHelperText>Enter a username!</FormHelperText>
                        <FormErrorMessage>A username is required to register!</FormErrorMessage>
                    </FormControl>
                    <FormControl id="password" onChange={handleChange} isInvalid={invalid && register.password.length < 8} isRequired={true}>
                        <FormLabel>Password</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter a password'
                            />
                            <InputRightElement width='4.5rem'>
                                <IconButton h='1.75rem' size='sm' isRound={true} icon={show ? <ViewOffIcon/> : <ViewIcon/>} onClick={handleClick}/>
                            </InputRightElement>
                        </InputGroup>
                        <FormHelperText>Enter a password!</FormHelperText>
                        <FormErrorMessage>A password greater than 8 characters is required to register!</FormErrorMessage>
                    </FormControl>
                        <FormControl id="passwordConfirm" onChange={handleChange} isInvalid={(invalid && confrimPass.length < 8) || ((register.password.length > 6 && confrimPass.length > 1) && register.password !== confrimPass)} isRequired={true}>
                        <FormLabel>Confirm Password</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter a password'
                            />
                            <InputRightElement width='4.5rem'>
                                <IconButton h='1.75rem' size='sm' isRound={true} icon={show ? <ViewOffIcon/> : <ViewIcon/>} onClick={handleClick}/>
                            </InputRightElement>
                        </InputGroup>
                        <FormHelperText>Enter a password!</FormHelperText>
                        <FormErrorMessage>Passwords do not match!</FormErrorMessage>
                    </FormControl>
                    <FormControl id="firstname" onChange={handleChange} isInvalid={invalid && register.firstname.length < 1} isRequired={true}>
                        <FormLabel>First Name</FormLabel>
                        <Input placeholder="John" />
                        <FormHelperText>Enter your first name!</FormHelperText>
                        <FormErrorMessage>First name is required!</FormErrorMessage>
                    </FormControl>
                    <FormControl id="lastname" onChange={handleChange} isInvalid={invalid && register.lastname.length < 1} isRequired={true}>
                        <FormLabel>Last Name</FormLabel>
                        <Input placeholder="Smith" />
                        <FormHelperText>Enter your last name!</FormHelperText>
                        <FormErrorMessage>Last name is required!</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={invalid && register.rank.length < 1} isRequired={true}>
                        <FormLabel>Rank</FormLabel>
                        <AutoComplete openOnFocus onChange={handleAutocomplete}>
                            <AutoCompleteInput variant="outline" />
                            <AutoCompleteList>
                                {Object.entries(ranks).map(([type, rank], co_id) => (
                                    <AutoCompleteGroup key={co_id} showDivider>
                                        <AutoCompleteGroupTitle textTransform="capitalize">
                                            {type}
                                        </AutoCompleteGroupTitle>
                                        {rank.map((rank, c_id) => (
                                            <AutoCompleteItem
                                                key={c_id}
                                                value={rank}
                                                textTransform="capitalize"
                                            >
                                                {rank}
                                            </AutoCompleteItem>
                                        ))}
                                    </AutoCompleteGroup>
                                ))}
                            </AutoCompleteList>
                        </AutoComplete>
                        <FormHelperText>Select your rank!</FormHelperText>
                        <FormErrorMessage>A rank is required!</FormErrorMessage>
                    </FormControl>
                    <FormControl id="role" onChange={handleChange} isInvalid={invalid && register.isApprover === null} isRequired={true}>
                        <FormLabel>Role</FormLabel>
                        <Select placeholder="Role">
                            <option value="user">User</option>
                            <option value="approver">Approver</option>
                        </Select>
                        <FormHelperText>Select your role!</FormHelperText>
                        <FormErrorMessage>An user role is required!</FormErrorMessage>
                    </FormControl>
                    <Center>
                        <Button isLoading={loading} onClick={submitRegister}>Register</Button>
                    </Center>
                    <Text textAlign="center">
                        Already have an account?{' '}
                        <Link color='teal.500' href='/'>
                            sign in
                        </Link>
                    </Text>
                </Stack>
            </Box>
        </>
    )
}