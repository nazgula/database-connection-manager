import axios from "axios";

interface Database {
    id: number;
    name: string;
    username: string;
    type: string;
}

const fetchDBList = async (queryKey?: string) => {
    const addParams = queryKey ? `?id=${queryKey}` : '';
    console.log('load', queryKey);

    const apiRes = await axios.get<Database[]>('http://localhost:4000/databases' + addParams);

    if (apiRes.status < 200 || apiRes.status >= 300) {
        throw new Error(`No connection`);
    }

    return apiRes.data
};

export default fetchDBList;
