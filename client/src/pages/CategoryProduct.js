import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import "../styles/CategoryProductStyles.css";
import "../styles/Homepage.css";

const CategoryProduct = () => {
    const [products, setProducts] = useState();
    const [category, setCategory] = useState();
    const params = useParams();
    const navigate = useNavigate();

    //get products by cat
    const getProductsByCat = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products);
            setCategory(data?.category);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getProductsByCat();
    }, [])


    return (
        <Layout>
            <div className="container mt-3">
                <h2 className='text-center'>Category - {category?.name}</h2>
                <h6 className='text-center'>{products?.length} products found</h6>
                <div className="d-flex flex-wrap">
                    {products?.map(p => (
                        <div
                            key={p._id}
                            className='product-link'>

                            <div className="card m-2" style={{ width: '18rem' }} >
                                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}...</p>
                                    <p className="card-text">${p.price}</p>
                                    <button
                                        className="btn btn-primary ms-1"
                                        onClick={() => { navigate(`/product/${p.slug}`) }}
                                    >
                                        More Details
                                    </button>
                                    <button className="btn btn-secondary ms-1">Add To Card</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct
