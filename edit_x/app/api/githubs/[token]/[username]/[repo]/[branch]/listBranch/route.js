
import React from 'react'
// require('dotenv').config();
import bodyParser from 'body-parser';

// Parse JSON bodies for this API
export const config = {
    api: {
        bodyParser: true,
    },
};
import { Octokit } from "octokit";


export const GET=async(request,{params})=>{
    
    try{

       
       
  
        
    const octokit = new Octokit({ 
        auth:params.token,
      });
    
    const user=params.username;
    const repo=params.repo;
    const branch=params.branch;
    
   

    
    try{
   
    // console.log("reso",reso) 
    // console.log("sha",reso.data.sha)// Log the response data;
   
    
    const respo=await octokit.request('GET /repos/{owner}/{repo}/branches', {
        owner: user,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    console.log(respo,"respo");
    return new Response(JSON.stringify({ message: "successful" ,bod:respo}), {
        headers: { "Content-Type": "application/json" }
      });
      
    }
    catch(error){
        console.log("err", error)
        return new Response(JSON.stringify({ message: "Branch does not exist or incorrect credentials/tokens" }), {
            headers: { "Content-Type": "application/json" }
          });  
    }

}
catch(error){
    console.log("err", error)
    return new Response(JSON.stringify({ message: "invalid user/token" }), {
        headers: { "Content-Type": "application/json" }
      });  
}
}




