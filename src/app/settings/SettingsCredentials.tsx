import { Box, TextField, Typography, useTheme } from "@mui/material";
import _ from "lodash";
import { CredentialName, CREDENTIALS_FORMATTED_NAMES } from "../model/Credentials";
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
    const remainingCredentialsList = Object.values(CredentialName).filter((credentialName) =>
        !requiredCredentialsList.find((credentialListItem) =>
            credentialListItem.name === credentialName
        )
    );

    const updateCredentials = (credentials: CredentialName, value: string) => {

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

                    {requiredCredentialsList.map((credentialListItem) => (

                        <Box
                            display="flex"
                            flexDirection="column"
                        >
                            <TextField
                                label={CREDENTIALS_FORMATTED_NAMES[credentialListItem.name]}
                                sx={{ marginTop: 2 }}
                                value={userData.credentials?.[credentialListItem.name] ?? ""}
                                onChange={(e) => updateCredentials(credentialListItem.name, e.target.value)}
                                fullWidth
                            />

                            {Boolean(credentialListItem.specificChildren) &&
                                <Box
                                    marginTop={1}
                                    paddingX={2}
                                >
                                    {credentialListItem.specificChildren}
                                </Box>
                            }
                        </Box>
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
                            label={CREDENTIALS_FORMATTED_NAMES[credentials]}
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