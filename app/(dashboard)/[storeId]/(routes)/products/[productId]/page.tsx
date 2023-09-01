import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
    params
} : {
    params: {productId: string, storeId: string}
}) => {
    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include:{
            images: true
        }
    });
    //you need to call the categories on the server side
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId,
        }
    });

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId,
        }
    });
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId,
        }
    });


    return ( 
        <div className="dflex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* This is where you passing the data into the product-form from the server side */}
                <ProductForm 
                    categories = {categories}
                    colors = {colors}
                    sizes  = {sizes}
                    initialData={product}
                
                />
            </div>

        </div>
    );
}
 
export default ProductPage;