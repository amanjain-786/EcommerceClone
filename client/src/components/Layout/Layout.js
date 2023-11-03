import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Helmet } from "react-helmet"
import toast, { Toaster } from 'react-hot-toast';

const Layout = (props) => {
    return (
        <div>
            <Helmet>
                <meta charset="UTF-8" />
                <title>
                    {props.title}
                </title>
                <meta name="description" content={props.description} />
                <meta name="keywords" content={props.keywords} />
                <meta name="author" content={props.author} />
            </Helmet>
            <Header></Header>
            <main style={{ minHeight: "80vh" }}>
                <Toaster />
                {props.children}
            </main>
            <Footer></Footer>
        </div>
    )
}


Layout.defaultProps = {
    title: 'Ecommerce App - shop now',
    description: 'mern stack project',
    keywords: 'mern,react,node,mongodb',
    author: "Aman jain"
}


export default Layout
