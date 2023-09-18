import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, description } = await request.json();
  await connectMongoDB();

  // await Topic.create({ title, description });
  // return NextResponse.json({ message: "Topic Created" }, { status: 201 });

  try {
    await Topic.create({ title, description });
    return NextResponse.json({ message: "Topic Created" }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {  // Duplicate key error code for MongoDB
      return NextResponse.json({ error: "Duplicate Topic" }, { status: 409 });
    }
    // Handle other unexpected errors
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 });
  }
}

export async function GET() {
  await connectMongoDB();
  const topics = await Topic.find();
  return NextResponse.json({ topics });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Topic.findByIdAndDelete(id);
  return NextResponse.json({ message: "Topic deleted" }, { status: 200 });
}