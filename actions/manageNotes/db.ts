import 'server-only'
import { PrismaClient } from '@prisma/client';
import { TDBNoteEntry } from '@/lib/types';

const prisma = new PrismaClient();

export async function GetNotes(){

    try{
        const res = await prisma.word.findMany();
        return res;
    }catch (error) {
        
        if(error instanceof Error){
            console.log('GetNotes: ERROR: API - ', error?.message);
        }

    }
}

export async function ImportNotes(note : TDBNoteEntry){
  
    try{

        const newNotes = await prisma.word.create({
          data:{
            user_id: note.user_id,
            word: note.word,
            status: note.status,
            language: note.language,
            user_notes: note.user_notes,
            generated_notes: note.generated_notes,
            audio: note.audio,
            repetitions: note.repetitions,
            days: note.days,
            ease_factor: note.ease_factor, 
            review_date: note.review_date
          }
        })

        return newNotes;
    } catch(error){

        if(error instanceof Error){
          console.log('ImportNotes: ERROR: API - ' + error.message);  
        }

    }
}

export async function GetNoteById(noteId : number){
  
    try{
        const res = await prisma.word.findUnique({where: {id: noteId}});

        return res;
    } catch(error){

        if(error instanceof Error){
          console.log('GetNoteById: ERROR: API - ' + error.message);
        }

  }
}

export async function UpdateRepetitionFactors(note : TDBNoteEntry){
  
    try{
        const res = await prisma.word.update({where: {id: note.id}, 
            data: {
                days: note.days,
                repetitions: note.repetitions, 
                ease_factor: note.ease_factor, 
                review_date: note.review_date
            }
        });

        return res;
    } catch(error){

    if(error instanceof Error){
      console.log('UpdateRepetitionFactors: ERROR: API - ' + error.message);
    }

  }
}

export async function DeleteNote(noteId : number){
    
    try{
        const res = await prisma.word.delete({where: {id: noteId}});
        
        return res;
    } catch(error){

    if(error instanceof Error){
      console.log('DeleeteNote: ERROR: API - ' + error.message);
    }
  }
}

export async function  DeleteUnverifiedNotes(ids : number[]){
  
    try{
        let res;
        for(const id of ids)
            res = await prisma.word.deleteMany({where: {id: id}});

        return res;
    } catch(error){

        if(error instanceof Error){
            console.log('DeleteUnverifiedNotes: ERROR: API - ' + error.message);
        }

  }
}

export async function SetNoteLearned(noteId : number, status : boolean){
  
    try{
        const res = await prisma.word.update({where: {id: noteId}, data: {status: status}});
    
        return res;
    } catch(error){

        if(error instanceof Error){
            console.log('SetNoteLearned: ERROR: API - ' + error.message);
        }
  }
}

export async function EditNotes(userNotes : string, generatedNotes : string, noteId : number){
    
    try{
        const res = await prisma.word.update({ where: {id: noteId}, data: {user_notes: userNotes, generated_notes: generatedNotes}});
      
        return res;
    } catch(error){
  
      if(error instanceof Error){
        console.log('EditNotes: ERROR: API - ' + error.message);
      }

    }
  }
  
  export async function ResetNoteRecallFactors(noteId : number, days : number, repetitions : number, easeFactor : number, reviewDate : Date){
    try{
        const res = await prisma.word.update({where: {id: noteId}, 
            data: {
                days: days, 
                repetitions: repetitions,
                ease_factor: easeFactor,
                review_date: reviewDate,
                status: false,
            }
        });
        
        return res;
    } catch(error){
  
      if(error instanceof Error){
        console.log('ResetNoteRecallFactors: ERROR: API - ' + error.message);
      }

    }
  }
