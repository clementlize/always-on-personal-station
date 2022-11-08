import { Box, Button, Dialog } from "@mui/material";
import { ContentModule, ContentModuleType, MODULE_NAMES } from "../model/ContentModule";

interface NewModuleModalProps {
    currentModules: ContentModule[];
    createModule: (newModuleType: ContentModuleType) => void;
    closeModal: () => void;
}

const NewModuleModal: React.FC<NewModuleModalProps> = (props) => {

    const { currentModules, createModule, closeModal } = props;

    return (

        <Dialog
            open
            onClose={() => closeModal()}
        >

            <Box
                display="flex"
                flexDirection="column"
                padding={2}
                alignItems="center"
            >

                {Object.values(ContentModuleType).map((type, index) => {

                    if (!currentModules.find(m => m.type === type)) {

                        return (

                            <Button
                                key={index}
                                onClick={() => {
                                    createModule(type);
                                    closeModal();
                                }}
                                sx={{
                                    width: "fit-content",
                                    marginTop: index !== 0 ? 2 : 0,
                                }}
                            >
                                {MODULE_NAMES[type]}
                            </Button>
                        );
                    }

                    return null;
                })}

            </Box>

        </Dialog>
    )
}

export default NewModuleModal;