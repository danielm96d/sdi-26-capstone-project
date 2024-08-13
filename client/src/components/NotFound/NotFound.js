import { Heading, Text, Avatar, Center, Stack, Link, Box } from "@chakra-ui/react";

export default function NotFound() {
    return (
        <>
            <Box textAlign="center">

                <Stack>

                    <Heading>404 Not Found</Heading>
                    <Center>
                        <Avatar size="2xl" src="./elonez.jpg" />
                    </Center>
                    <Text>This is not the page you are looking for! Try going <Link color="teal.400" href="/">home</Link></Text>
                </Stack>
            </Box>
        </>
    )
}