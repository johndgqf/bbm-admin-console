import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
// This api route is for update and delete individual homepage feature

export async function GET(
  req: Request,
  { params }: { params: { homepageFeatureId: string } }
) {
  try {
    if (!params.homepageFeatureId) {
      return new NextResponse("Homepage feature id is required", {
        status: 400,
      });
    }

    const homepageFeature = await prismadb.homepageFeature.findUnique({
      where: {
        id: params.homepageFeatureId,
      },
    });

    return NextResponse.json(homepageFeature);
  } catch (error) {
    console.log("[HOMEPAGE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  //   Extracting parameters of both storeId and homepageFeatureId
  { params }: { params: { storeId: string; homepageFeatureId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    // Extracting content fields from the body.
    const { title, content, imageUrl } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
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
    if (!params.homepageFeatureId) {
      return new NextResponse("Homepage feature id id is required", {
        status: 400,
      });
    }
    // Fetching the data from database to make sure that other user wont be able to use the homepage feature id to change the contents that belong to a different store
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const homepageFeature = await prismadb.homepageFeature.updateMany({
      where: {
        id: params.homepageFeatureId,
      },
      data: {
        title,
        content,
        imageUrl,
      },
    });

    return NextResponse.json(homepageFeature);
  } catch (error) {
    console.log("[HOMEPAGE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; homepageFeatureId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.homepageFeatureId) {
      return new NextResponse("Homepage feature id is required", {
        status: 400,
      });
    }

    // Fetching the data from database to make sure that other user wont be able to use the homepage feature id to change the contents that belong to a different store
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const homepageFeature = await prismadb.homepageFeature.deleteMany({
      where: {
        id: params.homepageFeatureId,
      },
    });

    return NextResponse.json(homepageFeature);
  } catch (error) {
    console.log("[HOMEPAGE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
