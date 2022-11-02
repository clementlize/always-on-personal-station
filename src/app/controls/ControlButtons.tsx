import LockIcon from '@mui/icons-material/Lock';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, useTheme } from "@mui/material";

interface ControlButtonsProps {
    lockScroll: boolean;
    toggleLockScroll: () => void;
    settingsOpened: boolean;
    openSettings: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = (props) => {

    const { lockScroll, toggleLockScroll, settingsOpened, openSettings } = props;

    const theme = useTheme();

    const getButtonColor = (isActive: boolean): string => {
        return isActive ? theme.palette.secondary.dark : theme.palette.background.paper;
    }

    return (

        <Box
            position="fixed"
            left={0}
            bottom={0}
            padding={3}
            display="flex"
            flexDirection="column"
        >

            <Button
                style={{
                    backgroundColor: getButtonColor(settingsOpened),
                    padding: theme.spacing(1.5),
                    marginBottom: theme.spacing(1.5),
                }}
                onClick={() => openSettings()}
            >
                <SettingsIcon fontSize="medium" />
            </Button>

            <Button
                style={{
                    backgroundColor: getButtonColor(lockScroll),
                    padding: theme.spacing(1.5),
                }}
                onClick={() => toggleLockScroll()}
            >
                <LockIcon fontSize="medium" />
            </Button>

        </Box>
    );
}

export default ControlButtons;