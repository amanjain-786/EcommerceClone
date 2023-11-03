import React from 'react'

const CategoryFrom = ({ handleSubmit, value, setValue }) => {
    // we are making this as a resuable component bro
    //jahan bhi hame ek input ki need hogi we will import and use this man
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="text"
                        className="form-control"
                        placeholder='Enter new category'
                        value={value} onChange={(e) => { setValue(e.target.value); }} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </>
    )
}

export default CategoryFrom;