"use server"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import getAuthUser from '@/lib/getAuthUser';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function User(){
   
    const authUser = await getAuthUser();

    if(!authUser)
        redirect('/logIn');

    
    return (
            
        <div className="flex flex-col justify-center items-center mt-60 bg-blue-400 w-[500px] h-[200px] rounded-4xl">
            <form action="" className="form w-[450px]">
                <div className="flex flex-col justify-center items-center">
                    <input className='text-blue-50 formInput my-8' type="text" name="word" placeholder='Enter new word here...'/>
                    <button className='primaryBtn' type='submit'> <b>Enter word</b> </button>
                </div>
            </form>
        </div>
        
    )
}