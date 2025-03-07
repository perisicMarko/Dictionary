"use server"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import getAuthUser from '@/actions/getAuthUser';
import { redirect } from 'next/navigation';
import React from 'react';
import UserInput from '@/components/UserInput';

export default async function User(){
   
    const authUser = await getAuthUser();

    if(!authUser)
        redirect('/logIn');

    return (
            
        <UserInput></UserInput>
    );
}