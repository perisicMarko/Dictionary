/* eslint-disable @typescript-eslint/no-explicit-any */

import Note from '@/components/Note';

export default function Words({props} : {props : any}){
    
    return (
        <>
        {
            props.map((w : any) => {
                return <Note key={w.id} notes={w} ></Note>
            })
        }
        </>

    );
}