import React from 'react'
import Layout from '../components/Layout/Layout'

const Policy = () => {
    return (
        <Layout title={"Privacy Policy - Ecommerce app"}>
            <div className="row contactus ">
                <div className="col-md-6 ">
                    <img
                        src="/images/privacyPolicy.jpg"
                        alt="privacy policy"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-4 text-center">
                    <h3>Privacy Policy</h3>
                    <p className="text-justify mt-2">
                        <b>privacy policy</b>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum ipsa voluptas ipsam quaerat, omnis exercitationem.</p>
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default Policy
