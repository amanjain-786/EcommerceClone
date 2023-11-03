import React from 'react'
import { useSearch } from '../../context/Search'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {

    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    //form submit handler 
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.get(`/api/v1/product/search/${values.keyword}`);
            setValues({ ...values, results: data });
            navigate("/search");
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <form className="d-flex search-form" role="search" onSubmit={handleSubmit}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    value={values.keyword}
                    onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                    aria-label="Search" />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
        </div>
    )
}

export default SearchInput
