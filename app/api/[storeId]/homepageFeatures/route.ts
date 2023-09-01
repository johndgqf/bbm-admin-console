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
    const { title, content, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }
    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    // This is to prevent other user from stealing other person store id and inject a feature to the store homepage.
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //We are gonna create a homepage feature
    const homepageFeature = await prismadb.homepageFeature.create({
      data: {
        title,
        content,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(homepageFeature);
  } catch (error) {
    console.log("[HOMEPAGES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Construct a GET API to request all the created homepage features from the database.
export async function GET(
  req: Request,
  //   Because the way we structure our files inside the [storeId] folder, we will always have access to the params of storeId
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    //We are gonna create a homepage feature
    const homepageFeatures = await prismadb.homepageFeature.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(homepageFeatures);
  } catch (error) {
    console.log("[HOMEPAGES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
