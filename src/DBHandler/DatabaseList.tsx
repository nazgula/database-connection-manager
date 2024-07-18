import { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DatabaseDetails from './DatabaseDetails';
import fetchDBList from '../fetchDBList';
import Page from '../BasicComponents/Page';
import AddModal from '../BasicComponents/AddModal';

interface Col {
    field: string,
    headerName: string,
    width: string
}
const columns: Col[] = [
    { field: 'name', headerName: 'Name', width: '15em' },
    { field: 'username', headerName: 'Username', width: '15em' },
    { field: 'type', headerName: 'Type', width: '15em' },
];

const DatabaseList: React.FC = () => {
    const [openDBModal, setOpenDBModal] = useState(false);
    const [mockId, setMockId] = useState(3);
    const navigate = useNavigate();

    const results = useQuery({
        queryKey: ['DB'],
        queryFn: () => fetchDBList(),
    });

    const rows = useMemo(() => {
        console.log('results', results.data);
        return results.data || [];
    }, [results.data]);


    if (results.isLoading) {
        return (
            <div className="loading-pane">
                <h2 className="loader">🌀</h2>
            </div>
        );
    }

    if (results.isFetched) {
        console.log('Data is fetched and cached');
    }

    const handleDBRowClick = (id: number) => {
        navigate(`/details/${id}`);
    };


    function onAddDBClick() {
        setMockId(prevMockId => prevMockId + 1);
        setOpenDBModal(true)

    }

    function renderModal() {
        return (
            <AddModal
                open={openDBModal}
                handleClose={() => {
                    setOpenDBModal(false);
                }} style={{
                    border: '2px solid #000', boxShadow: 24, p: 8,
                    display: 'flex', flexDirection: 'column',
                    gap: '10px', justifyContent: 'center', alignItems: 'center'
                }}>
                <DatabaseDetails onSubmit={setOpenDBModal} mockId={mockId.toString()} />
            </AddModal>
        )
    }

    return (
        <Page title="Databases List">
            <Button onClick={() => onAddDBClick()}>+</Button>
            {renderModal()}
            <Table sx={{ width: '100%', margin: '2em' }}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.field} style={{ width: column.width }}>
                                {column.headerName}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((database) => (
                        <TableRow hover key={database.id} onClick={() => handleDBRowClick(database.id)}>
                            <TableCell>{database.name}</TableCell>
                            <TableCell>{database.username}</TableCell>
                            <TableCell>{database?.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Page>
    );
};

export default DatabaseList;