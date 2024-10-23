import connectMongoDB from "@/libs/mongodb";
import Contact from "@/models/contactModel";
import Messages from "@/models/messageModel";
import { NextResponse } from "next/server";
import authenticateMiddleware, { getLoginId } from "@/middleware/authMiddleware";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        }, 
    },
};



async function getHandler(req) {
    try { 
        const authenticated = await authenticateMiddleware(req);
        if (!authenticated) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectMongoDB();
        const sender_id = getLoginId(req);
        const messages = await Messages.find({ sender_id });
        const userIDs = messages.map(({ sender_id, receiver_id }) => [sender_id, receiver_id]).flat();
        const uniqueUserIDs = [...new Set(userIDs)].filter(id => id !== sender_id);
        const contacts = await Contact.find({ user_id: uniqueUserIDs , created_by: sender_id });
        return NextResponse.json({ contacts });    
    } catch (error) {          
        console.error("Error Getting Contacts:", error);
        return NextResponse.json({ message: "Error Getting Contacts" }, { status: 500 });
    } 
}
  

module.exports = {
    config,
    middleware: [authenticateMiddleware],
    GET: getHandler,
};