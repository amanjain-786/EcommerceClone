import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { GiShoppingCart } from 'react-icons/gi'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'
import SearchInput from '../form/SearchInput'
import useCategory from '../../hooks/useCategory'
import { useCart } from '../../context/cart'
import { Badge } from 'antd';


const Header = () => {

    const [auth, setAuth] = useAuth();
    const categories = useCategory();
    const [cart] = useCart();

    const handleLogout = () => {
        //clear the local storage bro
        setAuth({
            ...auth,
            user: null,
            token: ""
        })
        localStorage.removeItem('auth');
        // Navigate('/login');
        toast.success("logout successfully");
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link to="/" className="navbar-brand"> <GiShoppingCart></GiShoppingCart> AJ's Store</Link>
                        <SearchInput></SearchInput>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link"  >Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <div
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown">
                                    Categories
                                </div>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link
                                            to="/categories"
                                            className='dropdown-item'
                                        >
                                            All Categories
                                        </Link>
                                    </li>
                                    {categories?.map(c => (
                                        <li key={c._id}>
                                            <Link
                                                to={`/category/${c.slug}`}
                                                className="dropdown-item"
                                            >
                                                {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            {
                                !auth.user ? (<>
                                    <li className="nav-item">
                                        <NavLink to="/register" className="nav-link" >Register</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/login" className="nav-link" >Login</NavLink>
                                    </li>
                                </>) : (<>
                                    <li className="nav-item dropdown">
                                        <NavLink className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {auth?.user?.name}
                                        </NavLink>
                                        <ul className="dropdown-menu">
                                            <li><NavLink to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="dropdown-item">Dashboard</NavLink></li>
                                            <li><NavLink onClick={handleLogout} to="/login" className="dropdown-item" >Logout</NavLink></li>
                                        </ul>
                                    </li>

                                </>)
                            }
                            <li className="nav-item">
                                <NavLink to="/cart" className="nav-link" >
                                    Cart
                                    <Badge count={cart?.length} showZero />
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Header
