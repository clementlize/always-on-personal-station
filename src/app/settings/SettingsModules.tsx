import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, IconButton, Switch, TextField, Typography } from "@mui/material";
import _ from "lodash";
import { useState } from 'react';
import WeatherSettings from "../../modules/Weather/pages/WeatherSettings";
import { DEFAULT_DISPLAY_TIME } from "../Defaults";
import { ContentModule, ContentModuleType, MODULE_NAMES } from "../model/ContentModule";
import NewModuleModal from './NewModuleModal';

interface SettingsModulesProps {
    modules: ContentModule[];
    credentials: { [key: string]: string } | undefined;
    setModules: (newModules: ContentModule[]) => void;
}

const SettingsModules: React.FC<SettingsModulesProps> = (props) => {

    const { modules, setModules } = props;

    const [expandedModuleRefs, setExpandedModuleRefs] = useState<string[]>([]);
    const [showAddModuleDialog, setShowAddModuleDialog] = useState<boolean>(false);

    const onSwitchChange = (module: ContentModule, checked: boolean) => {

        const newModules = _.cloneDeep(modules);
        const foundModule = newModules.find(m => m.ref === module.ref);
        if (foundModule) {
            foundModule.disabled = !checked;
        }
        setModules(newModules);
    }

    const onTimeChange = (module: ContentModule, time: number) => {

        const controlledTime = time > 0 ? time : DEFAULT_DISPLAY_TIME;

        const newModules = _.cloneDeep(modules);
        const foundModule = newModules.find(m => m.ref === module.ref);
        if (foundModule) {
            foundModule.display_time = controlledTime;
        }
        setModules(newModules);
    }

    const moveUp = (module: ContentModule) => {

        const newModules = _.cloneDeep(modules);

        const foundModule = newModules.find(m => m.ref === module.ref);
        const foundIndex = newModules.findIndex(m => m.ref === module.ref);

        if (foundModule && foundIndex > 0) {

            newModules.splice(foundIndex, 1);
            newModules.splice(foundIndex - 1, 0, foundModule);
            setModules(newModules);
        }
    }

    const moveDown = (module: ContentModule) => {

        const newModules = _.cloneDeep(modules);

        const foundModule = newModules.find(m => m.ref === module.ref);
        const foundIndex = newModules.findIndex(m => m.ref === module.ref);

        if (foundModule && foundIndex >= 0 && foundIndex < newModules.length - 1) {

            newModules.splice(foundIndex, 1);
            newModules.splice(foundIndex + 1, 0, foundModule);
            setModules(newModules);
        }
    }

    const addModule = (newModuleType: ContentModuleType) => {

        const newModules = _.cloneDeep(modules);
        newModules.push({
            ref: _.uniqueId(),
            type: newModuleType,
        });
        setModules(newModules);
    }

    const expandButtonClicked = (ref: string) => {

        if (expandedModuleRefs.includes(ref)) {
            setExpandedModuleRefs(expandedModuleRefs.filter(r => r !== ref));
        }
        else {
            setExpandedModuleRefs([...expandedModuleRefs, ref]);
        }
    }

    const setModuleSettings = (module: ContentModule, newSettings: any) => {

        const newModules = _.cloneDeep(modules);
        const foundModule = newModules.find(m => m.ref === module.ref);
        if (foundModule) {
            foundModule.extended_settings = newSettings;
        }
        setModules(newModules);
    }

    const renderModuleSettings = (module: ContentModule) => {

        switch (module.type) {

            case ContentModuleType.WEATHER_NOW:
            case ContentModuleType.WEATHER_FORECAST:
                return (
                    <Box marginTop={2}>
                        <WeatherSettings
                            moduleSettings={module.extended_settings}
                            setModuleSettings={(newSettings: any) => setModuleSettings(module, newSettings)}
                        />
                    </Box>
                );

            default: return null;
        }
    }

    return (

        <>

            {showAddModuleDialog &&
                <NewModuleModal
                    currentModules={modules}
                    createModule={(newModuleType: ContentModuleType) => addModule(newModuleType)}
                    closeModal={() => setShowAddModuleDialog(false)}
                />
            }

            <Box
                display="flex"
                flexDirection="column"
            >

                {modules.map((module, index) => {
                    return (

                        <Box
                            key={index}
                            display="flex"
                            flexDirection="column"
                            bgcolor="background.paper"
                            padding={2}
                            borderRadius={2}
                            marginTop={index !== 0 ? 2 : 0}
                        >

                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >

                                <Box
                                    display="flex"
                                    alignItems="center"
                                >

                                    <Switch
                                        checked={!module.disabled}
                                        onChange={(e) => onSwitchChange(module, e.target.checked)} />

                                    <Typography marginLeft={2}>
                                        {MODULE_NAMES[module.type]}
                                    </Typography>

                                </Box>

                                <IconButton onClick={() => expandButtonClicked(module.ref)}>
                                    {expandedModuleRefs.includes(module.ref)
                                        ? <KeyboardArrowUpIcon />
                                        : <KeyboardArrowDownIcon />}
                                </IconButton>

                            </Box>

                            {expandedModuleRefs.includes(module.ref) &&

                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    marginTop={2}
                                >

                                    <Box
                                        display="flex"
                                        alignItems="center"
                                    >

                                        <TextField
                                            label="Time"
                                            type="number"
                                            value={module?.display_time ?? DEFAULT_DISPLAY_TIME}
                                            onChange={(e) => onTimeChange(module, parseInt(e.target.value))}
                                        />

                                        <Button
                                            variant="contained"
                                            sx={{ marginLeft: 2 }}
                                            onClick={() => moveUp(module)}
                                            disabled={index === 0}
                                        >
                                            <Typography>
                                                Move up
                                            </Typography>
                                        </Button>

                                        <Button
                                            variant="contained"
                                            sx={{ marginLeft: 2 }}
                                            onClick={() => moveDown(module)}
                                            disabled={index === modules.length - 1}
                                        >
                                            <Typography>
                                                Move down
                                            </Typography>
                                        </Button>

                                    </Box>

                                    {renderModuleSettings(module)}

                                </Box>}

                        </Box>
                    );
                })}

                <Button
                    variant="contained"
                    sx={{ marginTop: 2, width: "fit-content" }}
                    onClick={() => setShowAddModuleDialog(true)}
                    disabled={modules.length === Object.keys(ContentModuleType).length}
                >
                    <Typography>
                        Add module
                    </Typography>
                </Button>
            </Box>

        </>
    );
}

export default SettingsModules;