import React, { useEffect, useState } from "react"

const Page = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch("https:development.esaral.com/v1/mentorship/get-spayee-user-courses?spayee_id=66641f9b328c7c6a58e174a4")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(alert)

    }, [])

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}

export default Page;