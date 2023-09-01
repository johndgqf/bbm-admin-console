import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  //   Because the way we structure our files inside the [storeId] folder, we will always have access to the params of storeId
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    // Define what you are gonna extract from the body element
    const { title, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    // This is to prevent other user from stealing other person store id and inject a map to the store map.
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //We are gonna create a map
    const map = await prismadb.map.create({
      data: {
        title,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(map);
  } catch (error) {
    console.log("[MAPS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Construct a GET API to request all the created store map from the database.
export async function GET(
  req: Request,
  //   Because the way we structure our files inside the [storeId] folder, we will always have access to the params of storeId
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    //We are gonna create a map
    const maps = await prismadb.map.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(maps);
  } catch (error) {
    console.log("[MAPS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
