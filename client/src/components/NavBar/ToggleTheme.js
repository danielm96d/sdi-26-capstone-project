import { IconButton, useColorMode } from "@chakra-ui/react"
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function ToggleTheme() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <IconButton isRound={true} onClick={toggleColorMode} icon={colorMode === "dark" ? <SunIcon/> : <MoonIcon/>}/>
    )
}