import { Box, Card, Typography } from "@mui/material";

interface PageProps {
    title: string;
    children?: React.ReactNode;

}

const Page: React.FC<PageProps> = (props) => {
    const { title, children } = props;

    return (
        <Box sx={{ padding: '1em', width: '100%', height: '50%', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ padding: '2em', display: 'flex', flexDirection: 'column', gap: '2em', justifyContent: 'center', alignItems: 'center' }}>
                <Typography id="modal-modal-title" variant="h6" component="h1">
                    {title}
                </Typography>

                {children}
            </Card>
        </Box>
    );
}
export default Page;