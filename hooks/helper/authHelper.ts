import prisma from "@/app/lib/prisma";

export function isEmailMethod(user : any) {
    if(user.method == "email-cred") {
        return true;
    }
}

export function isGmailMethod(user : any) {
    if(user.method == "gmail") {
        return true;
    }
}

export function isGithubMethod(user : any) {
    if(user.method == "github") {
        return true;
    }
}


export async function checkExistingUser(email:string) {
    const res = await prisma.user.findUnique({
        where: {
            email:email
        }
    });
    if(res) return res;
    else return false;
}