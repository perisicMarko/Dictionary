import Link from 'next/link';

export default function Page(){
    return (
        <div className="flex justify-center mt-50 w-[500px] h-1/2 bg-blue-400 rounded-2xl border-2 border-blue-50">
          <form className="form w-full px-2 py-2" action="">
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
          <div>
            <label htmlFor="confirmPassword">Confirm password: </label>
            <input className="formInput" type="password" name="confirmPassword"/>
          </div>
          <div className="center">
              <button className="primaryBtn">Sing up</button>
              <div className='inline-block hover:scale-105 ml-1'>
                <Link href="login"><i><u>Or log in here</u></i></Link>  
              </div>
          </div>
          </form>
        </div> 
    );
}