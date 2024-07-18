import { Box, Modal, Typography, Link } from '@mui/material';

interface AddDatabaseProps {
    open: boolean;
    handleClose: () => void;
    style?: any;
    title?: string;
    children?: React.ReactNode
}

//@ts-ignore
const AddModal = (props: AddDatabaseProps) => {
    const { open, handleClose, style, children, title } = props;
    return (
        <Modal
            open={open}
            onClose={handleClose} >
            <Box sx={style}>
                <Box sx={{
                    width: '50vw', backgroundColor: 'white',
                    padding: '1em', display: 'flex', flexDirection: 'column',
                    gap: '10px', justifyContent: 'center', alignItems: 'center'
                }}>
                    <Typography component="h2">
                        {title}
                    </Typography>
                    {children}
                    <Link onClick={handleClose}>Back</Link>
                </Box>
            </Box>
        </Modal>
    );
}

export default AddModal;