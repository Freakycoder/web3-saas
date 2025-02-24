import axios from "axios"
import { useEffect, useState } from "react"

const GetTask = () => {

    const [name , setname] = useState<string>('');

    useEffect(() => {
        const getAllTask = async() => {
            const response = await axios.get('http://localhost:3000/v1/user/connected', {})
        }
    })


    return <div>
       
    </div>
}