import { NextResponse } from "next/server";
import authenticateMiddleware from "@/middleware/authMiddleware";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

async function logoutHandler(req) {
    const authenticated = await authenticateMiddleware(req);
    if (!authenticated) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    req.headers.delete('Authorization');
    req.headers.delete("authorization");
    return NextResponse.json({ message: "Logout successful" }, { status: 200, headers: { "Set-Cookie": "" } });
}

module.exports = {
    config,
    middleware: [authenticateMiddleware],
    GET: logoutHandler
};