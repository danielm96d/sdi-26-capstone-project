import { Divider, Flex, Heading } from "@chakra-ui/react";
import ToggleTheme from "./ToggleTheme";

export default function NavBar() {
    return(
        <>
        <Flex padding="1rem" justifyContent="space-between">
            <Heading>SiteName</Heading>
            <Flex>
                <ToggleTheme/>
            </Flex>
        </Flex>
        <Divider marginBottom="2em" />
        </>
    )
}