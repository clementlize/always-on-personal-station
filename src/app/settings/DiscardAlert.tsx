import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

interface DiscardAlertProps {
    handleClose: () => void;
    handleDiscard: () => void;
}

const DiscardAlert: React.FC<DiscardAlertProps> = (props) => {

    const { handleClose, handleDiscard } = props;

    return (
        <Dialog
            open={true}
            onClose={handleClose}
        >
            <DialogTitle>
                <Typography>
                    Discard changes?
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography>
                    You have unsaved changes. Are you sure you want to discard them?
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => handleClose()}>
                    <Typography>
                        Cancel
                    </Typography>
                </Button>
                <Button onClick={handleDiscard}>
                    <Typography>
                        Discard
                    </Typography>
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DiscardAlert;