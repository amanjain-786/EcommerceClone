import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment'

const Orders = () => {

    const [auth, setAuth] = useAuth();
    const [orders, setOrders] = useState([]);

    const getOrders = async () => {
        try {
            const { data } = await axios.get('/api/v1/auth/orders');
            setOrders(data);
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (auth?.token) {
            getOrders();
        }
    }, [auth?.token])

    return (
        <Layout title="Your Orders">
            <div className="container-fluid p-3 m-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center'>All Orders</h1>
                        {
                            orders?.map((o, i) => {
                                return (
                                    <div className="border shadow">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Buyer</th>
                                                    <th scope="col">Order Date</th>
                                                    <th scope="col">Payment</th>
                                                    <th scope="col">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{i + 1}</td>
                                                    <td>{o?.status}</td>
                                                    <td>{o?.buyer?.name}</td>
                                                    <td>{moment(o?.createAt).fromNow()}</td>
                                                    <td>{o?.payment.success ? "Success" : "Failed"}</td>
                                                    <td>{o?.products?.length}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="container">
                                            {o?.products?.map((p, i) => (
                                                <div className="row mb-2 card flex-row p-3">
                                                    <div className="col-md-4">
                                                        <img
                                                            src={`/api/v1/product/product-photo/${p._id}`}
                                                            className="card-img-top"
                                                            alt={p.name}
                                                            width="150px"
                                                            height="150px"
                                                        />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <h4>{p.name}</h4>
                                                        <p>{p.description.substring(0, 30)}....</p>
                                                        <p>Price : ${p.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Orders
