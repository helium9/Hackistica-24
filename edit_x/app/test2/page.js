"use client"
import React from 'react'
require('dotenv').config();
import { Octokit } from "octokit";

const token="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";
const octokit = new Octokit({ 
  auth:token,
});



const page = () => {

  const method=async ()=>{
    const res=await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "xenom2004",
      repo: "hackistica_test",
      per_page: 2
    });

    console.log(res," response ");

    

  }

  const method2=async()=>{
    const res=await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'xenom2004',
      repo: 'hackistica_test',
      path: 'first',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    console.log(res," response ");

    
    

  }

  const method3=async()=>{
    try {
      console.log(token)
      // Perform the request with authentication
      const response = await octokit.request('GET /user', {
        headers: {
          // Pass your GitHub personal access token in the Authorization header
          Authorization: `token ${token}`
        }
      });
  
      console.log(response.data);

      const reso=await octokit.request(
          'GET /repos/{owner}/{repo}/contents/{path}',
          {
            owner: 'xenom2004',
            repo: 'hackistica_test',
            path: 'first',
          },
        );
      console.log(reso.data.sha)// Log the response data;
      const up=Buffer.from("hello ").toString('base64')
      
      const respo=await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: 'xenom2004',
        repo: 'hackistica_test',
        path: 'first',
        message: 'a new commit message',
        committer: {
          name: 'Monalisa Octocat',
          email: 'octocat@github.com'
        },
        content: up,
        sha: reso.data.sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      console.log(respo,"RESO")// Log the response data
  
    } catch (error) {
      console.error("Error:", error); // Log any errors that occur
    }
    
    

    
    

  }

  return (<>    
    <div onClick={method} className='bg-white'>commit</div>
    <div onClick={method2} className='bg-white'>take</div>
    <div onClick={method3} className='bg-white'>take</div>


    </>

  )
}

export default page
