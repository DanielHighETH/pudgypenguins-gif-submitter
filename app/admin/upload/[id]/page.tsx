'use client'
import OnlyAdmin from "@/app/components/OnlyAdmin";

function Upload({ params }: { params: { id: string } }) {
    return(
        <div>
            <h1>Upload Page</h1>
        </div>
    )
}

export default OnlyAdmin(Upload)