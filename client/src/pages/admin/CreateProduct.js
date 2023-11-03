import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd'
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CreateProduct = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");


    //getting all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category');
            if (data?.success) {
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



    //create product handler function
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("photo", photo);
            productData.append("category", category);
            productData.append("shipping", shipping);
            const data = axios.post('/api/v1/product/create-product', productData);
            if (data?.success) {
                toast.error(data?.message);
            }
            else {
                toast.success("product created successfully");
                navigate('/dashboard/admin/products');
            }
        }
        catch (err) {
            console.log(err);
            toast.error('something went wrong');
        }
    }



    return (
        <Layout title="Dashboard - Create Product">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Create Product</h1>
                        <div className="m-1 w-75">
                            <Select
                                bordered={false}
                                placeholder="select a category"
                                size="large"
                                showSearch
                                className="form-select mb-3"
                                // this value field is provided by the package we have
                                //installed the antd to have even ki jagah issi ka 
                                //use karlenge bro
                                onChange={(value) => { setCategory(value) }}
                            >

                                {categories?.map(c => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}

                            </Select>
                            <div className="mb-3">
                                <label className='btn btn-outline-secondary col-md-12'>
                                    {photo ? photo.name : "Add Photo"}
                                    <input type="file" name="photo" accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>
                            <div className="mb-3">
                                {photo && (
                                    <div className="text-center">
                                        {/* now yaar direct ham photo dal to de par usse performance par effect padega bro */}
                                        {/* so we use the browser's url */}
                                        {/* as ek image selected hai then bro we can use it and access it's link man */}
                                        {/* let's see how can we do it bro */}
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt={photo.name} height={"200px"}
                                            className='img img-responsive'
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={name}
                                    placeholder="write a name"
                                    onChange={(e) => setName(e.target.value)}
                                    className='form-control'
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    type="text"
                                    value={description}
                                    placeholder="Product description"
                                    onChange={(e) => setDescription(e.target.value)}
                                    className='form-control'
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={price}
                                    placeholder="Product Price"
                                    onChange={(e) => setPrice(e.target.value)}
                                    className='form-control'
                                    min="0"
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={quantity}
                                    placeholder="product quantity"
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className='form-control'
                                    min="0"
                                />
                            </div>
                            <div className="mb-3">
                                <Select
                                    bordered={false}
                                    placeholder="select shipping"
                                    size="large"
                                    showSearch
                                    className="form-select mb-3"
                                    // this value field is provided by the package we have
                                    //installed the antd to have even ki jagah issi ka 
                                    //use karlenge bro
                                    onChange={(value) => { setShipping(value) }}
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>

                                </Select>
                            </div>
                            <div className="mb-3">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={handleCreate}
                                >
                                    Create Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct
