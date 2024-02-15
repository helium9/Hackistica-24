"use client"
const { Octokit } = require("@octokit/core");

// Create an Octokit instance with authentication
const octokit = new Octokit({
  auth: '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'// Replace with your personal access token
});

// Define the parameters for the update operation
const owner = "xenom2004"; // Replace with your GitHub username or organization name
const repo = "hackistica_test";
const path = "first"; // Replace with the path to the file you want to update
const branch = "main"; // Replace with the branch name

// Read the content of the existing file

const activate=async ()=>{

    const existingContent = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        ref: branch
      });
      
      // Encode the new content as base64
      const newContent = Buffer.from("Your new file content").toString('base64');
      
      // Update the file
      try {
        const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path,
          branch,
          message: "Update file via Octokit.js", // Commit message
          content: newContent,
          sha: existingContent.data.sha // SHA hash of the existing file
        });
      
        console.log("File updated:", response.data);
      } catch (error) {
        console.error("Error updating file:", error);
      }
      

}


import React from 'react'

const page = () => {
  return (
    <div onClick={activate}>
      hell:
    </div>
  )
}

export default page

