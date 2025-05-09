import 'server-only';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function CreateDrawer(title : string, userId : number){
    try {
        const res = await prisma.drawers.create({
            data: {
                name: title,
                user_id: userId
            }
        });

        return res;
    }catch(e){
        if(e instanceof Error)
            console.log('Error while creating drawer, err message: ' + e.message);
    }
}

export async function GetUsersDrawers(userId : number){
    try {
        const drawers =  await prisma.drawers.findMany({
            where: {
                user_id : userId
            }
        });

        return drawers;
    }catch(e){
        if(e instanceof Error)
            console.log('Error while fetching drawers, err message: ' + e.message);
    }
}

export async function UpdateDrawerName(drawerName : string, drawerId: number){
    try {
        const res =  await prisma.drawers.update({
            where: {
                id: drawerId
            },
            data: {
                name: drawerName
            }
        });

        return res;
    }catch(e){
        if(e instanceof Error)
            console.log('Error updating drawer name, err message: ' + e.message);
    }
}

export async function DeleteDrawer(drawerId: number){
    try {
        const res =  await prisma.drawers.delete({
            where: {
                id: drawerId
            }
        });

        return res;
    }catch(e){
        if(e instanceof Error)
            console.log('Error deleting drawer, err message: ' + e.message);
    }
}


export async function PutWordInDrawer(drawerId: number, wordId : number){
    try {
        const res =  await prisma.drawers_and_words.create({
            data: {
                word_id: wordId,
                drawer_id: drawerId
            }
        });

        return res;
    }catch(e){
        if(e instanceof Error)
            console.log('Error putting word in drawer, err message: ' + e.message);
    }
}


export async function GetWordsOfDrawer(drawerId : number){
    try {
        const res = await prisma.drawers_and_words.findMany({
            where: {
              drawer_id: drawerId,
            },
            include: {
              words: true, 
            },
        });          
        
        return res;
    }catch(e){
        if(e instanceof Error)
            console.log('Error fetching words in opened drawer, err message: ' + e.message);
    }
}


export async function RemoveWordFromDrawer(wordId : number, drawerId : number){
    try {
        const res = await prisma.drawers_and_words.deleteMany({
            where: {
              drawer_id: drawerId,
              word_id: wordId,
            },
          });
        
        return res;
    }catch(e){
        if(e instanceof Error)
            console.log('Error removing word from drawer, err message: ' + e.message);
    }
}


export async function GetDrawerById(drawerId : number){
    try {
        const res = await prisma.drawers.findFirst({
            where: {
              id: drawerId
            },
          });
        
        return res;
    }catch(e){
        if(e instanceof Error)
            console.log('Error removing word from drawer, err message: ' + e.message);
    }
}
