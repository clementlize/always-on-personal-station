import { useState } from "react";
import { ContentModule, ModuleRefs } from "../model/ContentModule";
import ProgressBars from "../progressBar/ProgressBar";
import SettingsPage from "../settings/SettingsPage";
import ControlButtons from "./ControlButtons";

interface ControlsProps {
    modules: ContentModule[];
    setModules: (modules: ContentModule[]) => void;
    moduleRefs: ModuleRefs;
}

const Controls: React.FC<ControlsProps> = (props) => {

    const { modules, setModules, moduleRefs } = props;
    const [lockScroll, setLockScroll] = useState<boolean>(false);
    const [openSettings, setOpenSettings] = useState<boolean>(false);

    /////////////////
    // OTHER
    /////////////////

    return (

        <>

            <ProgressBars
                modules={modules}
                moduleRefs={moduleRefs}
                lockScroll={lockScroll}
            />

            <ControlButtons
                lockScroll={lockScroll}
                toggleLockScroll={() => setLockScroll(a => !a)}
                settingsOpened={openSettings}
                openSettings={() => setOpenSettings(true)}
            />

            {openSettings &&
                <SettingsPage
                    modules={modules}
                    setModules={(modules: ContentModule[]) => setModules(modules)}
                    closeModal={() => setOpenSettings(false)}
                />
            }

        </>
    )
}

export default Controls;