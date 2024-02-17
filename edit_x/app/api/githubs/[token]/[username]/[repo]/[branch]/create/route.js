
import React from 'react'
// require('dotenv').config();
import { Octokit } from "octokit";




export const GET=async(request,{params})=>{
    try{
        console.log("params",{params});
    const octokit = new Octokit({ 
        auth:params.token,
      });
      console.log(octokit)
      

    const commits=  await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: params.username,
        repo: params.repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    
    console.log(commits,"commits");
    return new Response(JSON.stringify({ message: "successful", commits }), {
        headers: { "Content-Type": "application/json" }
      });

}

    catch(error){
        console.log(error)
        return new Response("Incorrect token/username do not exits/no such repo please enter correct info",{type:false});
    }





}




