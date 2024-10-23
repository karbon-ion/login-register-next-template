
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import authenticateMiddleware from "@/middleware/authMiddleware";
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

// export async function POST(req){
//     const {name, email, password} = await req.json()
//     await connectMongoDB();
//     await User.create({name, email, password})
//     return NextResponse.json({message: "User Created"}, {status:200})
// }

async function postHandler(req) {
    try {
        await connectMongoDB();
        const { name, email, password } = await req.json();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        return NextResponse.json({ message: "User Created", user}, { status: 200 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Error creating user" }, { status: 500 });
    }
}
async function getHandler(req) {
    try {
        const authenticated = await authenticateMiddleware(req);
        if (!authenticated) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectMongoDB();
        const users = await User.find();
        return NextResponse.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
    }
}
async function deleteHandler(req) {
    try {
        const authenticated = await authenticateMiddleware(req);
        if (!authenticated) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectMongoDB();
        const id = await req.nextUrl.searchParams.get("id");
        const user = await User.findByIdAndDelete(id);
        return NextResponse.json({ message: "User Deleted", user }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
    }
}
module.exports = {
    config,
    middleware: [authenticateMiddleware],
    POST: postHandler,
    GET: getHandler,
    DELETE: deleteHandler,
};