import connectMongoDB from "@/libs/mongodb";
import Messages from "@/models/messageModel";
import Contact from "@/models/contactModel";
import { NextResponse } from "next/server";
import authenticateMiddleware, { getLoginId } from "@/middleware/authMiddleware";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        }, 
    },
};




async function postHandler(req) {
    try {
        const authenticated = await authenticateMiddleware(req);
        if (!authenticated) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectMongoDB();
        const { message, sender_id, receiver_id , file_upload} = await req.json();
            const messages = await Messages.create({ message, sender_id, receiver_id, file_upload });
            return NextResponse.json({ message: "Message Created", messages}, { status: 200 });    
        } catch (error) {
        console.error("Error creating Message:", error);
        return NextResponse.json({ message: "Error creating Message" }, { status: 500 });
    }
}
  
  
async function getHandler(req) {
    try {
      const authenticated = await authenticateMiddleware(req);
      if (!authenticated) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const url = new URL(req.url, `http://${req.headers.host}`);
      const receiver_id = url.searchParams.get('receiver_id');
      const sender_id = getLoginId(req);
  
      await connectMongoDB();
  
      const messages = await Messages.find({
        $or: [
          { $and: [{ sender_id, receiver_id }] },
          { $and: [{ sender_id: receiver_id, receiver_id: sender_id }] },
        ],
      }).sort({ createdAt: 'asc' });
  
      return NextResponse.json({ messages });
    } catch (error) {
      console.error("Error Getting Messages:", error);
      return NextResponse.json({ message: "Error Getting Messages" }, { status: 500 });
    }
  }
  

module.exports = { 
    config,
    middleware: [authenticateMiddleware],
    POST: postHandler,
    GET: getHandler,
};