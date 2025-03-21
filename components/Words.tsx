import Note from '@/components/Note';
import { TDBNoteEntry } from '@/lib/types';

export default function Words({props, historyNote, handle} : {props : TDBNoteEntry[], historyNote : boolean, handle : () => void}){

    return (
        <>
        {
            props.map((w : TDBNoteEntry) => {
                return <Note key={w.id} prop={w} historyNote={historyNote} handle={handle}></Note>
            })
        }
        </>
    );
}