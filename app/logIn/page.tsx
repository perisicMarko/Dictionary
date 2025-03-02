import Link from 'next/link';

export default function Page(){
    return (
        <div className="mt-50 bg-blue-400 rounded-2xl border-2 border-blue-50">
            <div className='flex justify-end items-start'>
                <Link className="xBtn mr-3" href="/"><b>x</b></Link>
            </div>
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
    );
}