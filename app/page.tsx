'use client'
import {useState} from 'react'
import '@/app/globals.css'



export default function Home() {
  const [about, setAbout] = useState(false);
  const [login, setLogin] = useState(false);
  const [signUp, setSignUp] = useState(false); 

  function handleClick({action} : {action: string}){
    if(action === "login"){
      setLogin(true);
      setSignUp(false);
      setAbout(false);
    }
    else if(action === "signUp"){
      setSignUp(true);
      setLogin(false);
      setAbout(false);
    }
    else if(action === "about"){
      setAbout(true);
      setLogin(false);
      setSignUp(false);
    }
    else 
      throw new Error('prop can be only login or signUp');
  }

  return (
    
    <div className="flex flex-col justify-center items-center">
     <div className="mt-60">
       <h1 className="w-100 text-2xl text-center hover:underline textThemeColor"> Interactive dictionary </h1>
     </div>  

     {
     about ? <>

           <div className="w-[420px] h-[660px] bg-blue-400 rounded-2xl border-2 border-blue-50 overflow-auto">
            <div className="flex justify-end bg-blue-500">
             <button className="Xbtn mr-3" onClick={() => setAbout(false)}> <b>x</b> </button>
            </div>
            <div>
             <p>
               Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus
               Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus
               Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus
               Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus
             </p>
            </div>
           </div>

         </>
        : 

       <div className="">
         <div className="center">
           <button className="primaryBtn" onClick={() => handleClick({action: "about"})}>About app</button> 
         </div>
       </div>
       }

       {
        login ?
        <div className="flex justify-center bg-blue-400 rounded-2xl border-2 border-blue-50">
          <form className="form" action="">
            <div>
                <label htmlFor="email">Email: </label>
                <input className="formInput" type="text" name="email"/>
            </div>
            <div>
                <label htmlFor="password">Password: </label>
                <input className="formInput" type="password" name="password"/>
            </div>
            <div className="center">
                <button className="primaryBtn" >Log in</button>
            </div>
          </form>
        </div> 
        :  
        <div className="center">
          <button className="primaryBtn" onClick={() => handleClick({action: "login"})}> Log in </button> 
        </div>
       }
      
       {
        signUp ?
        <div className="flex justify-center bg-blue-400 rounded-2xl border-2 border-blue-50">
          <form className="form" action="">
          <div>
              <label htmlFor="name">Name: </label>
              <input className="formInput" type="text" name="name"/>
          </div>            
          <div>
              <label htmlFor="lastName">Last name: </label>
              <input className="formInput" type="text" name="lastName"/>
          </div>                    
          <div>
              <label htmlFor="email">Email: </label>
              <input className="formInput" type="text" name="email"/>
          </div>
          <div>
              <label htmlFor="password">Password: </label>
              <input className="formInput" type="password" name="password"/>
          </div>
          <div className="center">
              <button className="primaryBtn" >Log in</button>
          </div>
          </form>
        </div> 
        :  
        <div className="center">
          <button className="primaryBtn" onClick={() => handleClick({action: "signUp"})}> Sign up </button>
        </div>
       } 
    </div>
    );
}


