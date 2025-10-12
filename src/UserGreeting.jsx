

function UserGreeting(props){
    const approvedstyle = {
        backgroundColor : "green",
        color: "white",
        padding :"10px",
        margin: "10px"

    }
    const deniedStyle = {
        backgroundColor : "red",
        color: "white",
        padding :"10px",
        margin: "10px"

    }
   
    const loginApproved = <h2 style = {approvedstyle}>Welcome {props.username}</h2>
    const loginDenied =  <h2 style = {deniedStyle}>Access Denied</h2>

    return(props.isLoggedIn ? loginApproved : loginDenied);
    

    
}

export default UserGreeting