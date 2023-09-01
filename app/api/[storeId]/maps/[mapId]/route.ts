import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
// This api route is for update and delete individual map

export async function GET(
  req: Request,
  { params }: { params: { mapId: string } }
) {
  try {
    if (!params.mapId) {
      return new NextResponse("Map id is required", {
        status: 400,
      });
    }

    const map = await prismadb.map.findUnique({
      where: {
        id: params.mapId,
      },
    });

    return NextResponse.json(map);
  } catch (error) {
    console.log("[MAP_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  //   Extracting parameters of both storeId and mapId
  { params }: { params: { storeId: string; mapId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    // Extracting content fields from the body.
    const { title, imageUrl } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }
    if (!params.mapId) {
      return new NextResponse("Map id id is required", {
        status: 400,
      });
    }
    // Fetching the data from database to make sure that other user wont be able to use the map id to change the contents that belong to a different store
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const map = await prismadb.map.updateMany({
      where: {
        id: params.mapId,
      },
      data: {
        title,
        imageUrl,
      },
    });

    return NextResponse.json(map);
  } catch (error) {
    console.log("[MAP_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; mapId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.mapId) {
      return new NextResponse("Map id is required", {
        status: 400,
      });
    }

    // Fetching the data from database to make sure that other user wont be able to use the map id to change the contents that belong to a different store
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const map = await prismadb.map.deleteMany({
      where: {
        id: params.mapId,
      },
    });

    return NextResponse.json(map);
  } catch (error) {
    console.log("[MAP_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
