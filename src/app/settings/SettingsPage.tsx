import { Box, Button, Dialog, DialogActions, DialogContent, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { ContentModule } from "../model/ContentModule";
import { UserData } from "../model/UserData";
import { getDefaultUserData } from "../utils/AppUtils";
import DiscardAlert from "./DiscardAlert";
import SettingsCredentials from "./SettingsCredentials";
import SettingsModules from "./SettingsModules";

interface SettingsProps {
    userData: UserData;
    setUserData: (newData: UserData) => void;
    closeModal: () => void;
}

const Settings: React.FC<SettingsProps> = (props) => {

    const { userData, setUserData, closeModal } = props;

    const [editedUserData, setEditedUserData] = useState<UserData>(userData);
    const [showDiscardAlert, setShowDiscardAlert] = useState<boolean>(false);

    enum SettingsTabs {
        MODULES = "modules",
        CREDENTIALS = "credentials",
        RESET_APP = "reset_app",
    }
    const [currentTab, setCurrentTab] = useState<SettingsTabs>(SettingsTabs.MODULES);

    return (

        <>

            {
                showDiscardAlert &&
                <DiscardAlert
                    handleClose={() => setShowDiscardAlert(false)}
                    handleDiscard={() => closeModal()}
                />
            }

            <Dialog
                open
                onClose={() => closeModal()}
                fullWidth
            >

                <DialogContent>

                    <Box
                        display="flex"
                        flexDirection="column"
                    >
                        <Box
                            marginBottom={2}
                        >
                            <Tabs
                                value={currentTab}
                                onChange={(_e, newValue) => setCurrentTab(newValue)}
                            >
                                <Tab label="Modules" value={SettingsTabs.MODULES} />
                                <Tab label="Credentials" value={SettingsTabs.CREDENTIALS} />
                                <Tab label="Reset app" value={SettingsTabs.RESET_APP} />
                            </Tabs>
                        </Box>

                        {currentTab === SettingsTabs.MODULES &&
                            <SettingsModules
                                modules={editedUserData.modules}
                                setModules={(newModules: ContentModule[]) => setEditedUserData({ ...editedUserData, modules: newModules })}
                                credentials={editedUserData.credentials}
                            />
                        }

                        {currentTab === SettingsTabs.CREDENTIALS &&
                            <SettingsCredentials
                                userData={editedUserData}
                                setUserData={(newUserData: UserData) => setEditedUserData(newUserData)}
                            />
                        }

                        {currentTab === SettingsTabs.RESET_APP &&
                            <Box
                                display="flex"
                                flexDirection="column"

                            >

                                <Typography sx={{ marginBottom: 2 }}>
                                    Warning: this will reset the app to its default state.
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        width: "fit-content",
                                    }}
                                    onClick={() => {
                                        setUserData(getDefaultUserData());
                                        closeModal();
                                    }}
                                >
                                    Reset application
                                </Button>

                            </Box>
                        }
                    </Box>

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setShowDiscardAlert(true)}>Discard</Button>
                    <Button
                        onClick={() => {
                            setUserData(editedUserData);
                            closeModal();
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default Settings;