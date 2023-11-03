import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from './../components/Layout/Layout';
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {

    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const navigate = useNavigate();

    //get products
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProducts(data?.product._id, data?.product.category._id);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params.slug]);

    //get similar product
    const getSimilarProducts = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data.products);
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <Layout>
            <div className="row container product-details" style={{ marginTop: "100px" }}>
                <div className="col-md-6">
                    {product?._id && <img
                        src={`/api/v1/product/product-photo/${product?._id}`}
                        alt={product?.name}
                        className='card-img-top'
                        style={{
                            height: 350,
                            widht: 350
                        }}
                    />}
                </div>
                <div className="col-md-6 product-details-info">
                    <h1 className='text-center'>Product Details</h1>
                    <h6>Name : {product?.name}</h6>
                    <h6>Description : </h6>
                    <p>{product?.description}</p>
                    <h6>Price: ${product?.price}</h6>
                    <h6>Category :</h6>
                    <p> {product?.category?.name}</p>
                    <h6>Shipping: {product?.shipping ? "Yes" : "No"}</h6>
                    <button className="btn btn-outline-secondary ms-1">Add To Card</button>
                </div>
            </div>
            <hr />
            <div className="row container similar-products">
                <h4>Similar Products</h4>
                {relatedProducts.length < 1 && <p className=' text-center'>No Simlar Product Found</p>}
                <div className="d-flex flex-wrap">
                    {relatedProducts?.map(p => (
                        <div
                            key={p._id}
                            className='product-link'>

                            <div className="card m-2" style={{ width: '18rem' }} >
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
                                        <button className="btn btn-secondary ms-1">Add To Card</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails
