
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

const createGithubFileBlob = async (githubAccessToken, repoFullName, content, encoding = "utf-8") => {
    const blobResp = await fetch(`https://api.github.com/repos/${repoFullName}/git/blobs`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${githubAccessToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            },
            body: JSON.stringify({
                "content": content,
                "encoding": encoding
            })
        })
    const response = await blobResp.json()

    return response.sha
}

const getShaForBaseTree = async (githubAccessToken, repoFullName, branchName) => {
    const baseTreeResp = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees/${branchName}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${githubAccessToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            },
        })
    const response = await baseTreeResp.json()

    return response.sha
}

const getParentSha = async (githubAccessToken, repoFullName, branchName) => {
    const parentResp = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/${branchName}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${githubAccessToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            },
        })
    const response = await parentResp.json()

    return response.object.sha
}

const createGithubRepoTree = async (githubAccessToken, repoFullName, branchName, articleFiles) => {
    const shaForBaseTree = await getShaForBaseTree(githubAccessToken, repoFullName, branchName)

    const tree = []

    for (var i = 0; i < articleFiles.length; i++) {
        const fileSha = await createGithubFileBlob(githubAccessToken, repoFullName, articleFiles[i].content, articleFiles[i].encoding)
        tree.push({
            "path": articleFiles[i].path.substring(1),
            "mode": "100644",
            "type": "blob",
            "sha": fileSha
        })
    }

    const payload = {
        "base_tree": shaForBaseTree,
        "tree": tree
    }

    const treeResp = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${githubAccessToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            },
            body: JSON.stringify(payload)
        })
    const response = await treeResp.json()

    return response.sha
}

const createGithubCommit = async (githubAccessToken,
    repoFullName,
    branchName,
    commitMessage,
    articleFiles) => {
    const tree = await createGithubRepoTree(githubAccessToken, repoFullName, branchName, articleFiles)
    const parentSha = await getParentSha(githubAccessToken, repoFullName, branchName)

    const payload = {
        "message": commitMessage,
        "tree": tree,
        "parents": [parentSha]
    }

    const response = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${githubAccessToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            },
            body: JSON.stringify(payload)
        })

    const commitResp = await response.json()
    const commitSha = commitResp.sha

    await updateGithubBranchRef(githubAccessToken, repoFullName, branchName, commitSha)
}

const updateGithubBranchRef = async (githubAccessToken, repoFullName, branchName, commitSha) => {
    const payload = {
        "sha": commitSha,
        "force": false
    }

    const response = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/${branchName}`,
        {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${githubAccessToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            },
            body: JSON.stringify(payload)
        })

    const commitResp = await response.json()
}


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

    
    try{
    const reso=await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner: user,
          repo: repo,
          path: content[0].path,
        },
      );
    // console.log("reso",reso) 
    // console.log("sha",reso.data.sha)// Log the response data;
    const up=Buffer.from(content[0].content).toString('base64')
    
    const respo=await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: user,
      repo: repo,
      path: content[0].path,
      message: 'new commit',
    //   committer: {
    //     name: 'Monalisa Octocat',
    //     email: 'octocat@github.com'
    //   },
      content: up,
      sha: reso.data.sha,
      branch: branch,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    console.log(respo,"commits");
    return new Response(JSON.stringify({ message: "successful" ,bod:respo}), {
        headers: { "Content-Type": "application/json" }
      });

    
    
    
    }catch(err){
       

      
        const up=Buffer.from(content[0].content).toString('base64')

        const reso=await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: user,
            repo: repo,
            path: content[0].path,
            message: 'my commit message',
            branch:branch,
            
            content: up,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
          return new Response(JSON.stringify({ message: "successful" ,bod:reso}), {
            headers: { "Content-Type": "application/json" }
          });  

      }   

}

    catch(error){
        console.log("err", error)
        return new Response(JSON.stringify({ message: "Branch does not exist or incorrect credentials/tokens" }), {
            headers: { "Content-Type": "application/json" }
          });  
    }

}




