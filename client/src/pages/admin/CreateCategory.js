import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from "react-hot-toast";
import axios from 'axios';
import CategoryFrom from '../../components/form/CategoryFrom';
import { Modal } from 'antd';

const CreateCategory = () => {

    const [categories, setCategories] = useState([]);
    //creating the states for the input form which we have used as a component bro
    const [name, setName] = useState('');
    //for the modal
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState(null);

    //getting all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category');
            if (data?.success) {
                //the below is called optional chaining
                //i.e agar data exist karega then only uske andar category ko dekha jega aur data is null ka error nahi aega bro 
                setCategories(data?.category);
            }
        }
        catch (err) {
            console.log(err);
            toast.error('something went wrong in getting category');
        }
    }


    useEffect(() => {
        getAllCategory();
    }, []);


    //handleForm for the create category bro
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/v1/category/create-category', { name });
            if (data.success) {
                toast.success(`${data.category.name} is created`);
                getAllCategory();
            }
            else {
                console.log(err);
                toast.error(data.message);
            }
        }
        catch (err) {
            console.log(err);
            toast.error('something went wrong in input')
        }
    }

    //handle form of updating category bro
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/api/v1/category/update-category/${selected._id}`, { name: updatedName });
            if (data.success) {
                toast.success(`${updatedName} is updated`);
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllCategory();
            }
            else {
                toast.error(data.message);
            }
        }
        catch (err) {
            console.log(err);
            toast.error("something went wrong in updating ");
        }
    }

    //handle form of deleting category bro
    const handleDelete = async (id, name) => {
        try {
            const { data } = await axios.delete(`/api/v1/category/delete-category/${id}`);
            if (data.success) {
                toast.success(`${name} is deleted`);
                getAllCategory();
            }
            else {
                toast.error(data.message);
            }
        }
        catch (err) {
            console.log(err);
            toast.error("something went wrong in deleting ");
        }
    }

    return (
        <Layout title="Dashboard - Create Category">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Manage Category</h1>
                        <div className="p-3 w-50">
                            <CategoryFrom handleSubmit={handleSubmit} value={name} setValue={setName}></CategoryFrom>
                        </div>
                        <div className='w-75'>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(c => {
                                        return <tr key={c._id}>
                                            <td key={c._id}>{c.name}</td>
                                            <td>
                                                <button
                                                    className='btn btn-primary ms-2'
                                                    onClick={() => {
                                                        setVisible(true);
                                                        setUpdatedName(c.name);
                                                        setSelected(c);
                                                    }}>
                                                    Edit</button>
                                                <button
                                                    className='btn btn-danger ms-2'
                                                    onClick={() => handleDelete(c._id, c.name)}
                                                >Delete</button>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>

                        </div>
                        <Modal
                            onCancel={() => setVisible(false)}
                            footer={null}
                            open={visible}>
                            <CategoryFrom value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default CreateCategory
