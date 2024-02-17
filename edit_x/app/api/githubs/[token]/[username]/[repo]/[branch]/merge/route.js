
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

export const POST=async(request,{params})=>{
    
    try{
    const body = await request.json();
    console.log("Received data:", body);  
    const octokit = new Octokit({ 
        auth:params.token,
      });
    const user=params.username;
    const repo=params.repo;
    const branch=params.branch;
    const content=body.content;
    console.log(branch);
    // for(let i=0;i<content.length;i++){
    //     console.log(content[i]);
    // }
    
    
    
    const respo=await octokit.request('POST /repos/{owner}/{repo}/merges', {
        owner: user,
        repo: repo,
        base: content[0],
        head: content[1],
        commit_message: 'Shipped cool_feature!',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    console.log(respo,"commits");
    return new Response(JSON.stringify({ message: "successful" ,bod:respo}), {
        headers: { "Content-Type": "application/json" }
      });

    
    
    
    }catch(err){
          return new Response(JSON.stringify({ message: "merge failed" }), {
            headers: { "Content-Type": "application/json" }
          });  

      }   

}







