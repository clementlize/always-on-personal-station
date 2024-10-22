import { useState } from "react";
import OpenWeatherMapMigrationAlert from "../misc/OpenWeatherMapMigrationAlert";
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

    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [lockScroll, setLockScroll] = useState<boolean>(false);
    const [openSettings, setOpenSettings] = useState<boolean>(false);

    const toggleFullscreen = () => {

        const documentElement = document.documentElement;

        // Want to close fullscreen
        if (fullscreen) {

            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            // @ts-ignore: Safari
            else if (document.webkitExitFullscreen) {
                // @ts-ignore: Safari
                document.webkitExitFullscreen();
            }
            // @ts-ignore: IE11
            else if (document.msExitFullscreen) {
                // @ts-ignore: IE11
                document.msExitFullscreen();
            }

            setFullscreen(false);
        }
        // Want to open fullscreen
        else {

            if (documentElement.requestFullscreen) {
                documentElement.requestFullscreen();
            }
            // @ts-ignore: Safari
            else if (documentElement.webkitRequestFullscreen) {
                // @ts-ignore: Safari
                documentElement.webkitRequestFullscreen();
            }
            // @ts-ignore: IE11
            else if (documentElement.msRequestFullscreen) {
                // @ts-ignore: IE11
                documentElement.msRequestFullscreen();
            }

            setFullscreen(true);
        }
    }

    return (

        <>
            <ProgressBars
                modules={userData.modules}
                moduleRefs={moduleRefs}
                lockScroll={lockScroll || openSettings}
            />

            <ControlButtons
                lockScroll={lockScroll}
                toggleLockScroll={() => setLockScroll(a => !a)}
                fullscreen={fullscreen}
                toggleFullscreen={() => toggleFullscreen()}
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

            <OpenWeatherMapMigrationAlert
                userData={userData}
                setUserData={setUserData}
                setLockScroll={setLockScroll}
            />
        </>
    )
}

export default Controls;