import { Heading, Text, Avatar, Center, Stack, Link, Box } from "@chakra-ui/react";
import { Helmet } from "react-helmet";

export default function NotFound() {
    return (
        <>
        <Helmet>
            <title>OpSync | Not Found</title>
        </Helmet>
            <Box textAlign="center">

                <Stack>

                    <Heading>404 Not Found</Heading>
                    <Center>
                        <Avatar size="2xl" src={process.env.PUBLIC_URL + '/elonez.jpg'} />
                    </Center>
                    <Text>{window.location.pathname} is not the page you are looking for! Try going <Link color="teal.400" href="/">home</Link></Text>
                </Stack>
            </Box>
        </>
    )
}