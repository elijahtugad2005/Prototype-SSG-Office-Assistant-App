import styles from './loginpage.module.css'
import React , { useState } from 'react';


function loginpage (){
   
    return (
    <div>
            <form action="login">
                <input type = "text" name="username" placeholder='Enter Username'/> 
                <input type = "password" name = "password " placeholder = "Enter Password"/>
            </form>
    </div>);
}

export default loginpage;