import axios from "axios"
import { useEffect } from "react"

const task = () => {

    useEffect(() => {
        const response = await axios.post('http://localhost:3000/signup',{
            name : "aamil",
            age: 24
        })

        const Responsetoken = response.data.data.token;
        localStorage.setItem("token", Responsetoken);
    })

    return <div>
        <input type="email"  />
        <button onClick={handleSignup}></button>
    </div>
}

const handleSignup = async() => {

}



res.json({message : "logged in succesfully", token : token});

// {
//     "headers" : "",
//     "data" : {
//         message : "logged in succesfully", token : token 
//     },
//     "status" : ""
// }