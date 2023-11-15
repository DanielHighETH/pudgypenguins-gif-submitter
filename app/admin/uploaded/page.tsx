'use client'
import OnlyAdmin from "../../components/OnlyAdmin";

function Uploaded() {
    return(
        <div>
            <h1>Uploaded Page</h1>
        </div>
    )
}

export default OnlyAdmin(Uploaded)