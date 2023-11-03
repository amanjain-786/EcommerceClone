import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

// the below is for the payment method bro.
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import "../styles/CartStyles.css";

const CartPage = () => {

  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  //new state to get token bro
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);


  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map(item => { total += item.price });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      });
    }
    catch (err) {
      console.log(err);
    }
  }



  //delete cart item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(myCart));
      setCart(myCart);
    } catch (error) {
      console.log(error);
    }
  };




  //getting the client token for the payments bro so let's go
  //get payment gateway toek
  const getToken = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/braintree/token');
      setClientToken(data?.clientToken);
    }
    catch (err) {
      console.log(err);
    }
  }


  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post('/api/v1/product/braintree/payment', {
        nonce,
        cart
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate('/dashboard/user/orders');
      toast.success("Payment Completed");
    }
    catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-2">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length > 1 ? `You Have ${cart?.length} items in your cart. ${auth?.token ? "" : "please login to checkout"}` : " Your Cart is Empty"}
            </h4>
          </div>
        </div>
        <div className="container">

          <div className="row">
            <div className="col-md-7 p-0 m-0">
              {cart?.map(p => (
                <div className="row card flex-row ">
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="150px"
                      height="150px"
                    />
                  </div>
                  <div className="col-md-4">
                    <h4>{p.name}</h4>
                    <p>{p.description.substring(0, 30)}....</p>
                    <p>Price : ${p.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {
              cart?.length > 0 &&
              <div className="col-md-5 cart-summary">
                <h4>Cart Summary</h4>
                <p className='fs-5'>Total | Checkout | Paymet</p>
                <hr />
                <h4>Total :{totalPrice()} </h4>
                {auth?.user?.address ? (
                  <>
                    <div className="mb-3">
                      <h4>Current Address-</h4>
                      <h5>{auth?.user?.address}</h5>
                      <button
                        className='btn btn-outline-warning'
                        onClick={() => { navigate('/dashboard/user/profile') }}
                      >
                        Update Address
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    {
                      auth?.token ? (
                        <button
                          className='btn btn-outline-warning'
                          onClick={() => { navigate('/dashboard/user/profile') }}
                        >
                          Update Address
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-warning"

                          // we add the state here taki vo vapis cart ke page par hi redirect kare bro
                          //nahi to vo home page par kar raha tha after login 
                          //now after login vo cart page par redirect karega bro
                          onClick={() => navigate('/login', {
                            state: '/cart'
                          })}
                        >Please Login To Checkout</button>
                      )
                    }
                  </div>
                )}
                <div className="mt-2">
                  {!clientToken || !auth?.token || !cart?.length ? (
                    ""
                  ) : (
                    <>
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />

                      <button
                        className="btn btn-primary"
                        onClick={handlePayment}
                        disabled={loading || !instance || !auth?.user?.address}
                      >
                        {loading ? "Processing ...." : "Make Payment"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CartPage
