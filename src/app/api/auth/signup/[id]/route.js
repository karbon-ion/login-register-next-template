import connectMongoDB from "@/libs/mongodb"
import User from "@/models/userModel"
import {NextResponse} from "next/server"
import authenticateMiddleware from "@/middleware/authMiddleware";


export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

// async function updateHandler(req, {params}){
//     const {id} = params;
//     const {name, email, password} = await req.json()
//     const authenticated = await authenticateMiddleware(req);
//         if (!authenticated) {
//             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }
//     await connectMongoDB();
//     const user = await User.findByIdAndUpdate(id, {name, email, password})
//     return NextResponse.json({message: "User updated", user}, {status:200})
// }

async function updateHandler(req, { params }) {
    const { id } = params;
    const { name, email, password } = await req.json();
    const authenticated = await authenticateMiddleware(req);
    if (!authenticated) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userToUpdate = await User.findById(id);
    if (email && email !== userToUpdate.email) {
        return NextResponse.json({ message: "Cannot update email" }, { status: 400 });
    }
    await connectMongoDB();
    const updatedUser = await User.findByIdAndUpdate( id, { name, email, password }, { new: true }  );
    return NextResponse.json({ message: "User updated", user: updatedUser }, { status: 200 });
}


async function getHandler(req, {params}){
    const {id} = params;
    const authenticated = await authenticateMiddleware(req);
        if (!authenticated) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    await connectMongoDB();
    const user = await User.findOne({_id: id})
    return NextResponse.json({user}, {status: 200})
}


module.exports = {
    config,
    middleware: [authenticateMiddleware],
    PUT: updateHandler,
    GET: getHandler
};