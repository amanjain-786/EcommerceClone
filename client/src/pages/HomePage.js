import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useCart } from '../context/cart'
import { AiOutlineReload } from "react-icons/ai";
import { toast } from 'react-hot-toast';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useCart();
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


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
        }
    }
    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);


    //get products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data?.products);
        }
        catch (err) {
            console.log(err);
            setLoading(false);
        }
    }


    //get total count
    const getTotal = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/product-count');
            setTotal(data?.total);
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (page === 1) {
            return;
        }
        loadMore();
    }, [page]);


    //load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setProducts([...products, ...data?.products]);
            setLoading(false);
        }
        catch (err) {
            console.log(err);
            setLoading(false);
        }
    }


    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked.length, radio.length]);



    //filter by cat
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        }
        else {
            all = all.filter(c => c !== id);
        }
        setChecked(all);
    }
    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
    }, [checked.length, radio.length]);


    //get filtered product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post('/api/v1/product/product-filter', { checked, radio });
            setProducts(data?.products);
        }
        catch (err) {
            console.log(err);
        }
    }



    return (
        <Layout title="All Products - Best Offers" description="buy the top quality product here">
            {/* banner image */}
            <img
                src="/images/banner.png"
                className="banner-img"
                alt="bannerimage"
                width={"100%"}
            />
            {/* banner image */}
            <div className="container-fluid row mt-3 home-page">
                <div className="col-md-3">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column m-3">
                        {categories?.map(c => (
                            <Checkbox
                                key={c._id}
                                onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column m-3">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="d-flex flex-column m-3">
                        <button className='btn btn-danger' onClick={() => window.location.reload()}>Reset Filters</button>
                    </div>
                </div>
                <div className="col-md-9">
                    {/* {JSON.stringify(radio, null, 4)} */}
                    <h1 className="text-center">All Products</h1>
                    <div className="d-flex flex-wrap">
                        {products?.map(p => (
                            <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <div className="card-name-price">
                                        <h5 className="card-title">{p.name}</h5>
                                        <h5 className="card-title card-price">${p.price}</h5>
                                    </div>
                                    <p className="card-text">{p.description.substring(0, 30)}...</p>
                                    <div className="card-name-price">

                                        <button
                                            className="btn btn-info ms-1"
                                            onClick={() => { navigate(`/product/${p.slug}`) }}
                                        >
                                            More Details
                                        </button>
                                        <button
                                            className="btn btn-dark ms-1"
                                            onClick={() => {
                                                localStorage.setItem("cart", JSON.stringify([...cart, p]));
                                                setCart([...cart, p]);
                                                toast.success("Item added to cart");
                                            }
                                            }
                                        >
                                            Add To Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='m-2 p-3'>
                        {products && products.length < total && (
                            <button
                                className="btn loadmore"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page + 1);
                                }}
                            >
                                {loading ? (
                                    "Loading ..."
                                ) : (
                                    <>
                                        {" "}
                                        Loadmore <AiOutlineReload />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage
