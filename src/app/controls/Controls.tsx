import { useState } from "react";
import { ModuleRefs } from "../model/ContentModule";
import { UserData } from "../model/UserData";
import ProgressBars from "../progressBar/ProgressBar";
import SettingsPage from "../settings/SettingsPage";
import ControlButtons from "./ControlButtons";

interface ControlsProps {
    userData: UserData;
    setUserData: (data: UserData) => void;
    moduleRefs: ModuleRefs;
}

const Controls: React.FC<ControlsProps> = (props) => {

    const { userData, setUserData, moduleRefs } = props;

    const [lockScroll, setLockScroll] = useState<boolean>(false);
    const [openSettings, setOpenSettings] = useState<boolean>(false);

    /////////////////
    // OTHER
    /////////////////

    return (

        <>

            <ProgressBars
                modules={userData.modules}
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
                    userData={userData}
                    setUserData={(userData: UserData) => setUserData(userData)}
                    closeModal={() => setOpenSettings(false)}
                />
            }

        </>
    )
}

export default Controls;