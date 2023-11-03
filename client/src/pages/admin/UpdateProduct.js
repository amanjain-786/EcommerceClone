import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './../../components/Layout/Layout';

const { Option } = Select;

const UpdateProduct = () => {
    const navigate = useNavigate();
    //as we are sending the req in react to usko params mein se access karne ke liye i have to do this bro so let's go man
    const params = useParams();

    const [categories, setCategories] = useState([]);
    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [id, setId] = useState("");
    const [pid, setPid] = useState("");


    //get single product bro
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            //now we have to fulfill the states bro taki prefilled data dikhe hame
            console.log(data);
            setName(data.product.name);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setShipping(data.product.shipping);

            setCategory(data.product.category);
            setId(data.product.category._id);
            setPid(data.product._id);
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getSingleProduct();
    }, []);


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



    //update product handler function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            //here we check ki photo update bhi hui hai ki nahi
            //agar nahi hui hogi then ye jaegi bhi ahi bro
            //this helps to increase the effieciency of our request man.
            photo && productData.append("photo", photo);
            productData.append("category", id);
            productData.append("shipping", shipping);
            const data = axios.put(`/api/v1/product/update-product/${pid}`, productData);
            if (data?.success) {
                toast.error(data?.message);
            }
            else {
                toast.success("product updated successfully");
                navigate('/dashboard/admin/products');
            }
        }
        catch (err) {
            console.log(err);
            toast.error('something went wrong');
        }
    }


    //delete a product handler
    const handleDelete = async () => {
        try {
            let answer = window.prompt("are you sure ? want to delete this product");
            if (!answer) {
                return;
            }
            const { data } = await axios.delete(`/api/v1/product/delete-product/${pid}`);
            if (data.success) {
                toast.success("product deleted successfully");
                navigate('/dashboard/admin/products');
            }
            else {
                toast.error("deletion failed try again");
            }
        }
        catch (err) {
            console.log(err);
            toast.error("deletion failed !!  Something went wrong");
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
                        <h1>Update Product</h1>
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
                                value={id}
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
                                {photo ? (
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
                                ) : (
                                    <div className="text-center">
                                        {/* now yaar direct ham photo dal to de par usse performance par effect padega bro */}
                                        {/* so we use the browser's url */}
                                        {/* as ek image selected hai then bro we can use it and access it's link man */}
                                        {/* let's see how can we do it bro */}
                                        <img
                                            src={`/api/v1/product/product-photo/${pid}`}
                                            height={"200px"}
                                            alt="product photo"
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
                                    value={shipping ? "Yes" : "No"}
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>

                                </Select>
                            </div>
                            <div className="mb-3">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={handleUpdate}
                                >
                                    Update Product
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleDelete}
                                >
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct
