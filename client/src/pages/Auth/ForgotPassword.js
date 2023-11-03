import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

import "../../styles/AuthStyles.css"

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [answer, setAnswer] = useState('');

    const navigate = useNavigate();

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();//to stop the default refresh bro
        // console.log(email, password);
        //we need to send this data on the server bro
        //and we use axios to do so man this is one of the best bro
        // toast.success("registered successfully");

        try {
            const res = await axios.post(`/api/v1/auth/forgot-password`, {
                email,
                newPassword,
                answer
            });
            if (res.data.success) {
                //ho gaya
                toast.success(res.data.message);
                navigate('/');
            }
            else {
                toast.error(res.data.message);
                // navigate('/api/v1/auth/login');
            }
        }
        catch (err) {
            console.log(err);
            toast.error("something went wrong");
        }

    }
    return (
        <Layout title="Forgot Password -Ecommerce app">
            <div className="form-container" style={{ minHeight: "90vh" }}>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">RESET PASSWORD</h4>
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter Your Email "
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Enter Your New Password"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Enter your best friend's name"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        UPDATE
                    </button>
                </form>
            </div>
        </Layout>
    )
}

export default ForgotPassword
