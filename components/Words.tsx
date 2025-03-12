import Note from '@/components/Note';
import { TDBNoteEntry } from '@/lib/types';

export default function Words({props} : {props : TDBNoteEntry[]}){
    
    return (
        <>
        {
            props.map((w : TDBNoteEntry) => {
                return <Note key={w.id} {...w}></Note>
            })
        }
        </>

    );
}