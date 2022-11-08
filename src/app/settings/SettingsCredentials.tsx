import { Box, TextField, Typography, useTheme } from "@mui/material";
import _ from "lodash";
import { Credentials, CREDENTIALS_NAMES } from "../model/Credentials";
import { UserData } from "../model/UserData";
import { getRequiredCredentialsList } from "../utils/AppUtils";

interface SettingsCredentialsProps {
    userData: UserData;
    setUserData: (newData: UserData) => void;
}

const SettingsCredentials: React.FC<SettingsCredentialsProps> = (props) => {

    const { userData, setUserData } = props;

    const theme = useTheme();

    const requiredCredentialsList = getRequiredCredentialsList(userData.modules);
    const remainingCredentialsList = Object.values(Credentials).filter((credential) => !requiredCredentialsList.includes(credential));

    const updateCredentials = (credentials: Credentials, value: string) => {

        const newUserData = _.cloneDeep(userData);

        if (!newUserData.credentials) {
            newUserData.credentials = {};
        }

        newUserData.credentials[credentials] = value;
        setUserData(newUserData);
    }

    return (

        <Box
            display="flex"
            flexDirection="column"
        >

            {requiredCredentialsList.length > 0 &&
                <Box
                    display="flex"
                    flexDirection="column"
                    bgcolor={theme.palette.info.dark}
                    padding={2}
                    borderRadius={2}
                >
                    <Typography>Required for you enabled modules</Typography>

                    {requiredCredentialsList.map((credentials) => (

                        <TextField
                            label={CREDENTIALS_NAMES[credentials]}
                            sx={{ marginTop: 2 }}
                            value={userData.credentials?.[credentials] ?? ""}
                            onChange={(e) => updateCredentials(credentials, e.target.value)}
                            fullWidth
                        />
                    ))}
                </Box>
            }

            {remainingCredentialsList.length > 0 &&
                <Box
                    display="flex"
                    flexDirection="column"
                    bgcolor={theme.palette.background.paper}
                    padding={2}
                    borderRadius={2}
                    marginTop={requiredCredentialsList.length > 0 ? 2 : 0}
                >
                    <Typography>Not required for you enabled modules</Typography>

                    {remainingCredentialsList.map((credentials) => (

                        <TextField
                            label={CREDENTIALS_NAMES[credentials]}
                            sx={{ marginTop: 2 }}
                            value={userData.credentials?.[credentials] ?? ""}
                            onChange={(e) => updateCredentials(credentials, e.target.value)}
                            fullWidth
                        />
                    ))}
                </Box>
            }

            {requiredCredentialsList.length === 0 && remainingCredentialsList.length === 0 &&
                <Typography>No credentials asked for now</Typography>
            }

        </Box>
    )
}

export default SettingsCredentials