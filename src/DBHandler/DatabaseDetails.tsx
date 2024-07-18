import { FC, useMemo } from "react";
import { Input, Button, InputLabel, MenuItem, Select } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import fetchDBList from "../fetchDBList";
import Page from "../BasicComponents/Page";

const dbTypes = ['Snowflake', 'Trino', 'MySQL'];

interface iDatabaseDetails {
    name?: string;
    url?: string;
    username?: string;
    password?: string;
    type?: string;
}

interface DatabaseDetailsProps {
    mockId?: string;
    onSubmit?: (value: boolean) => void;
}

const DatabaseDetails: FC<DatabaseDetailsProps> = (props) => {
    const { onSubmit } = props;
    const { id = '-1' } = useParams();
    const queryClient = useQueryClient();

    const results = useQuery({
        queryKey: ['DB', id],
        queryFn: () => fetchDBList(id),
    });

    const db: iDatabaseDetails = useMemo(() => {
        if (results.data && results.data.length > 0) {
            return results.data[0];
        } else {
            const cachedRow = queryClient.getQueryData<iDatabaseDetails>(['DB', id]);
            if (cachedRow) {
                return cachedRow;
            }
            return { id: '', name: '', url: '', username: '', password: '', type: '' };
        }
    }, [results.data, id, queryClient]);


    if (results.isLoading) {
        return (
            <div className="loading-pane">
                <h2 className="loader">🌀</h2>
            </div>
        );
    }

    //@ts-ignore
    const addNewDatabaseEntry = (newEntry) => {
        const currentDatabases = queryClient.getQueryData(['DB']) || [];

        //@ts-ignore
        const updatedDatabases = [...currentDatabases, newEntry];

        queryClient.setQueryData(['DB'], updatedDatabases);
        queryClient.setQueryData(['DB', newEntry.id], newEntry);

    };

    function getformData(e: React.FormEvent<HTMLFormElement>) {
        const { mockId } = props;
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const obj = {
            id: mockId,
            name: formData.get("name") as string ?? '',
            url: formData.get("url") as string ?? '',
            username: formData.get("username") as string ?? '',
            password: formData.get("password") as string ?? '',
            type: formData.get("type") as string ?? ''
        };

        addNewDatabaseEntry(obj);

        if (onSubmit) {
            onSubmit(false);
        }
    }


    function renderFormInput(name: string, placeholder: string, defaultVal: string = '', required: boolean = false) {
        return (
            <FormControl variant="standard" sx={{ m: 1, width: 250 }}>
                <label htmlFor={name}>
                    <Input id={name}
                        name={name}
                        placeholder={placeholder}
                        defaultValue={defaultVal}
                        fullWidth={true}
                        required={required}
                        readOnly={id !== '-1'} />
                </label>
            </FormControl>
        );
    }

    return (
        <Page title={db.name ? db.name + ' details' : 'Add New database'} >
            <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}
                onSubmit={getformData}>

                {renderFormInput('name', 'Database name', db.name, true)}
                {renderFormInput('url', 'URL', db.url, true)}
                {renderFormInput('username', 'User name', db.username)}
                {renderFormInput('password', 'Password', db.password)}

                <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                        labelId="type-label"
                        id="type"
                        name="type"
                        label="Database type"
                        defaultValue={db.type}>
                        {dbTypes.map((type) => (
                            <MenuItem
                                key={type}
                                value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {id === '-1' && <Button type='submit'>Submit</Button>}
            </form>

            {id !== '-1' && <Link to='/'>Back</Link>}
        </Page >
    );
};

export default DatabaseDetails;
