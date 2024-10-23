import connectMongoDB from "@/libs/mongodb"
import {NextResponse} from "next/server"
import Contact from "@/models/contactModel";
import authenticateMiddleware from "@/middleware/authMiddleware";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

async function updateHandler(req, { params }) {
    const { id } = params;
    const { name, email, user_id, created_by } = await req.json();
    const authenticated = await authenticateMiddleware(req);
    if (!authenticated) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectMongoDB();
    const updatedContact = await Contact.findByIdAndUpdate( id, { name, email, user_id, created_by }, { new: true }  );
    return NextResponse.json({ message: "Contact updated", contact: updatedContact }, { status: 200 });
}

async function getHandler(req, {params}){
    const {id} = params;
    const authenticated = await authenticateMiddleware(req);
        if (!authenticated) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    await connectMongoDB();
    const contact = await Contact.findOne({_id: id})
    return NextResponse.json({contact}, {status: 200})
}


async function deleteHandler(req, {params}) {
    const {id} = params;
    try {
        const authenticated = await authenticateMiddleware(req);
        if (!authenticated) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectMongoDB();
        const contact = await Contact.findByIdAndDelete(id);
        return NextResponse.json({ message: "Contact Deleted", contact }, { status: 200 });
    } catch (error) {
        console.error("Error deleting Contact:", error);
        return NextResponse.json({ message: "Error deleting Contact" }, { status: 500 });
    }
}

module.exports = {
    config,
    middleware: [authenticateMiddleware],
    PUT: updateHandler,
    GET: getHandler,
    DELETE: deleteHandler,
};