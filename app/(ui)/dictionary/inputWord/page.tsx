import { getAuthUser } from '@/actions/auth/index';
import { redirect } from 'next/navigation';
import React from 'react';
import UserInput from '@/components/UserInput';

export default async function User(){
   
    const authUser = await getAuthUser();

    if(!authUser)
        redirect('/logIn');

    return (
            
        <UserInput>
        </UserInput>
    );
}