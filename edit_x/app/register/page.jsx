"use client"
import React,{useState} from "react";
import { useRouter } from "@/node_modules/next/navigation";

export default function register(){
    const router = useRouter();
    const [info,setInfo] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [error,setError] = useState("");
    const [pending,setPending] = useState(false);
    async function handleSubmit(e){
        e.preventDefault();
        if(!info.username || !info.email || !info.password){
            setError("Must provide all the creditentials")
        }
        try {
            console.log("Hello");
            setPending(true);
            const res = await fetch("api/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(info),
                }
            );
            console.log(res);
            if(res.ok){
                setPending(false);
                const form = e.target;
                form.reset();
                router.push("/login");
                console.log("User sucessfulley register ")
            }else{
                const errrorData = await res.join();
                setError(errrorData.message)
                console.log("somting went wroong")
                setPending(false)
            }

        } catch (error) {
            setPending(false);
            setError("Something went wrong")
        }
    }
    console.log({info})
    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <div className="font-bold text-xl text bg-center">
                    <h3>Register</h3>
                </div>
                <div className="">
                    <input type="text" name="username" onChange={(e)=>{setInfo((prev)=>({...prev,[e.target.name]:e.target.value}))}} />
                    <label className="username">Username</label>
                </div>
                <div className="">
                    <input type="email" name="email" onChange={(e)=>{setInfo((prev)=>({...prev,[e.target.name]:e.target.value}))}}/>
                    <label className="email">Email</label>
                </div>
                <div className="">
                    <input type="password" name="password" onChange={(e)=>{setInfo((prev)=>({...prev,[e.target.name]:e.target.value}))}}/>
                    <label className="password">Password</label>
                </div>
                {error && <span>{error}</span>}
                <button disabled={pending?true:false} className="" type="submit">{pending?"Registering":"Register"}Register</button>
            </form>
        </div>
    )
}