import connectMongoDB from "@/libs/mongodb";
import Contact from "@/models/contactModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import authenticateMiddleware, { getLoginId } from "@/middleware/authMiddleware";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        }, 
    },
};

async function postHandler(req){ 
    try { 
        const authenticated = await authenticateMiddleware(req);
        if (!authenticated) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { email } = await req.json();
        const created_by = getLoginId(req);
        await connectMongoDB();
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found with the provided email" }, { status: 404 });
        }
        const contact = await Contact.create({
            name: user.name,
            email: user.email,
            user_id: user._id,
            created_by: created_by,
        });
        return NextResponse.json({ message: "Contact Created", contact }, { status: 200 });
    } catch (error) {
        console.error('Error parsing JSON from request body:', error);
        return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }
}

async function getHandler(req) {
    try { 
        const authenticated = await authenticateMiddleware(req);
        if (!authenticated) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const created_by = getLoginId(req);
        await connectMongoDB();
        const contacts = await Contact.find({ created_by });
        return NextResponse.json({ contacts });
    } catch (error) {
        console.error("Error Getting Contacts:", error);
        return NextResponse.json({ message: "Error Getting Contacts" }, { status: 500 });
    } 
}

module.exports = {
    config,
    middleware: [authenticateMiddleware],
    POST: postHandler,
    GET: getHandler,
};