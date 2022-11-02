import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch, TextField, Typography } from "@mui/material";
import _ from "lodash";
import { useState } from "react";
import { DEFAULT_DISPLAY_TIME } from "../Defaults";
import { ContentModule, ContentModuleType, MODULE_NAMES } from "../model/ContentModule";

interface SettingsProps {
    modules: ContentModule[];
    setModules: (modules: ContentModule[]) => void;
    closeModal: () => void;
}

const Settings: React.FC<SettingsProps> = (props) => {

    const { modules, setModules, closeModal } = props;
    const [editedModules, setEditedModules] = useState<ContentModule[]>(modules);

    const onSwitchChange = (moduleType: ContentModuleType, checked: boolean) => {

        if (checked) {
            const newModules = _.cloneDeep(editedModules);
            const foundModule = newModules.find(m => m.type === moduleType);
            if (foundModule) {
                delete foundModule.disabled;
            }
            else {
                newModules.push({ type: moduleType });
            }
            setEditedModules(newModules);
        }
        else {
            const newModules = _.cloneDeep(editedModules);
            const foundModule = newModules.find(m => m.type === moduleType);
            if (foundModule) {
                foundModule.disabled = true;
            }
            setEditedModules(newModules);
        }
    }

    const onTimeChange = (moduleType: ContentModuleType, time: number) => {

        const controlledTime = time > 0 ? time : DEFAULT_DISPLAY_TIME;

        const newModules = _.cloneDeep(editedModules);
        const foundModule = newModules.find(m => m.type === moduleType);
        if (foundModule) {
            foundModule.display_time = controlledTime;
        }
        else {
            newModules.push({ type: moduleType, display_time: controlledTime });
        }
        setEditedModules(newModules);
    }

    const moveUp = (moduleType: ContentModuleType) => {

        const foundIndex = editedModules.findIndex(m => m.type === moduleType);
        if (foundIndex === 0) {
            return;
        }

        const newModules = _.cloneDeep(editedModules);
        const foundModule = newModules.find(m => m.type === moduleType);
        if (foundModule) {
            const index = newModules.indexOf(foundModule);
            if (index > 0) {
                newModules.splice(index, 1);
                newModules.splice(index - 1, 0, foundModule);
            }
        }
        setEditedModules(newModules);
    }

    const moveDown = (moduleType: ContentModuleType) => {

        const foundIndex = editedModules.findIndex(m => m.type === moduleType);
        if (foundIndex === editedModules.length - 1) {
            return;
        }

        const newModules = _.cloneDeep(editedModules);
        const foundModule = newModules.find(m => m.type === moduleType);
        if (foundModule) {
            const index = newModules.indexOf(foundModule);
            if (index < newModules.length - 1) {
                newModules.splice(index, 1);
                newModules.splice(index + 1, 0, foundModule);
            }
        }
        console.log("DOWN", {
            newModules,
            editedModules,
            foundIndex,
            foundModule,
        });
        setEditedModules(newModules);
    }

    return (
        <Dialog
            open
            onClose={() => closeModal()}
        >
            <DialogTitle>
                Settings
            </DialogTitle>

            <DialogContent>
                {Object.values(ContentModuleType).map((contentModuleType, index) => {

                    const foundModule = editedModules.find(module => module.type === contentModuleType);

                    return (

                        <Box
                            key={index}
                            display="flex"
                            flexDirection="column"
                            gap={1}
                        >

                            <Typography>
                                {MODULE_NAMES[contentModuleType]}
                            </Typography>

                            <Box
                                display="flex"
                                gap={2}
                                alignItems="center"
                            >
                                <Switch
                                    checked={Boolean(foundModule && !foundModule.disabled)}
                                    onChange={(e) => onSwitchChange(contentModuleType, e.target.checked)}
                                />

                                <TextField
                                    label="Time"
                                    type="number"
                                    value={foundModule?.display_time ?? DEFAULT_DISPLAY_TIME}
                                    onChange={(e) => onTimeChange(contentModuleType, parseInt(e.target.value))}
                                />

                                <Typography>
                                    {`Position: ${editedModules.findIndex(m => m.type === contentModuleType)}`}
                                </Typography>

                                <Button onClick={() => moveUp(contentModuleType)}>
                                    UP
                                </Button>

                                <Button onClick={() => moveDown(contentModuleType)}>
                                    DOWN
                                </Button>
                            </Box>
                        </Box>
                    );
                })}
            </DialogContent>

            <DialogActions>
                <Button onClick={() => closeModal()}>Discard</Button>
                <Button
                    onClick={() => {
                        setModules(editedModules);
                        closeModal();
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Settings;