'use server';
import { decryptSession, SessionPayload } from "@/server/auth/schoolSession";
import { findAllSubscriptionsBySchoolId, findSubscriptionByEmail, insertActivationKey, updateActivationKey, updateSubscriptionEmail as updateSubscriptionEmailByAddress } from "@/features/schools/infrastructure/repository";
import { GenerateSchema } from "@/lib/rules";
import { TSubscription } from "@/lib/types";
import { validateActivationKeyExpirationDate } from "@/features/schools/domain/validation";

export async function generateActivationKey(state: {success: boolean, message: string, email: string, date: string} | undefined, formData: FormData){
    const inputEmail = formData.get('email')?.toString() as string;

    const validatedFields = GenerateSchema.safeParse({
        email: inputEmail,
    });

    if(!validatedFields.success){
        return {
            success: false,
            message: '',
            email: 'Please enter a valid email.',
            date: ''
        };
    }

    const payload = await decryptSession();
    if(!payload){ //401
        return {success: false, message: 'Unauthorized', email: '', date: ''};
    }

    const {schoolId} = payload as SessionPayload;
    // ovde jedno lako resenje moze da bude da za svaku skolu cuvam duzinu najduzeg kursa kako ne bi mogli da unesu nista sto je duze od toga, jer onda manje mogu da kradu
    // ako uspeju da iskombinuju sa kracim kursevima nesto ali to moram da opipam sa njima kolike su ralizke izmedju kurseva, 
    // jer ako je na pola kursa nece moci da prodaju nekome 2 a meni da uplate jednom pare a i korisnik bi imao pristup aplikaciji a to i njima ne odgovara da ne uzmu pare
    const now = new Date();

    // za sada je resenje da kurs ne moze biti duzi od 9 nedelja
    const activationKeyExpirationDate = new Date(formData.get('courseEnd')?.toString() as string);

    const dateValidationError = validateActivationKeyExpirationDate(now, activationKeyExpirationDate);
    if(dateValidationError)
        return {success: false, message: '', email: '', date: dateValidationError};

    const subscription = await findSubscriptionByEmail(inputEmail);

    if(!subscription){
        const retVal = await insertActivationKey(inputEmail, activationKeyExpirationDate, schoolId);
        if(!retVal)
            throw new Error('Activation Key creation failed, check manageSchools.');
    }else{
        if(!subscription?.languages?.includes(formData.get('language')?.toString() as string)){
            subscription.languages += 'e';
        }
        const retVal = await updateActivationKey(inputEmail, activationKeyExpirationDate, schoolId);
        if(!retVal)
            throw new Error('Activation Key update failed, check manageSchools.');
    }
    
    return {success: true, message: 'Key has been successfully generated. You can inform course atendee that he can access his account with this email.', email: '', date: ''};
}

export async function getSubscriptionsBySchool(){
    const session = await decryptSession();
    if(!session)
        return [] as TSubscription[];

    const { schoolId } = session;
    const subscriptions = await findAllSubscriptionsBySchoolId(schoolId);

    return subscriptions;
}

export async function updateSubscriptionEmail(email : string, newEmail : string){
    const session = await decryptSession();
    if(!session)
        return {success: false};

    const res = await updateSubscriptionEmailByAddress(email, newEmail);
    if(!res)
        return {success: false};

    return {success: true};
}
