import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
    //context
    const [auth, setAuth] = useAuth();
    //state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    //get user data
    useEffect(() => {
        //we get user from the auth bro
        const { email, name, phone, address } = auth?.user;
        setName(name);
        setEmail(email);
        setPhone(phone);
        setAddress(address);
    }, [auth?.user])


    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();//to stop the default refresh bro
        console.log(name, email, password, phone, address);
        //we need to send this data on the server bro
        //and we use axios to do so man this is one of the best bro
        // toast.success("registered successfully");

        try {
            const { data } = await axios.put(`/api/v1/auth/profile`, {
                name, email, password, phone, address
            });
            if (data?.error) {
                toast.error(data?.error);
            }
            else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data?.updatedUser;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile Updated Successfully");
            }
        }
        catch (err) {
            console.log(err);
            toast.error("something went wrong");
        }

    }


    return (
        <Layout title="Your Profile">
            <div className="container-fluid p-3 m-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="form-container" style={{ minHeight: "90vh" }}>
                            <form onSubmit={handleSubmit}>
                                <h4 className="title">User Profile</h4>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Enter Your Name"

                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Enter Your Email "

                                        disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control"
                                        id="exampleInputPassword1"
                                        placeholder="Enter Your Password"

                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Enter Your Phone"

                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Enter Your Address"

                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    UPDATE
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile
