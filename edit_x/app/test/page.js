"use client"
import React from 'react'
import { useState } from 'react';
// const simpleGit = require('simple-git');
// const git = simpleGit();

const Test_page = () => {
  
  const [subject,setsubject]=useState(1);
  const update=()=>{

    setsubject(subject+1);

  }

  // async function commitChanges(variables, message) {
  //   try {
  //     await git.add(variables);
  //     await git.commit(message);
  //     console.log('Changes committed successfully.');
  //   } catch (error) {
  //     console.error('Error committing changes:', error);
  //   }
  // }

const variablesToVersionControl = ['config.js', 'env.js']; 
const commitMessage = 'Update variables';

// commitChanges(variablesToVersionControl, commitMessage);

  return (<> 
  
     <div onClick={update} className='bg-blue-200 text-3xl shadow-xl w-fit inline-block'>
        Hello test
        the var is {subject}
      
    </div>
    </>

  )
}

export default Test_page;

