import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import connectMongoDB from "@/libs/mongodb"
import User from "@/models/userModel"
import { NextResponse } from "next/server";
export async function POST(req) {
    try {
        const { email, password } = await req.json();
        await connectMongoDB();
        const user = await User.findOne({ email }); 
        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "60d" });
        return NextResponse.json({ token, user }, { status: 200, headers: { "Authorization": `Bearer ${token}` } });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ message: "Error logging in" }, { status: 500 });
    }
}