import {format} from "date-fns";
import prismadb from "@/lib/prismadb";
import { HomepageFeatureClient } from "./components/client";
import { HomepageFeatureColumn } from "./components/columns";
//In order to use await inside a function you need to use async
const HomepageFeatures = async ({
    params
}: {
    params: {storeId: string}
}) => {
    // Fetching all homepage feature data to the homepageFeatures page 
    const homepageFeatures = await prismadb.homepageFeature.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy:{
            createdAt: 'desc'
        }
    })
    // Now after you have your homepageFeature fetched, you can start passing all the features to HomepageFeatureClient
    const formattedHomepageFeatures: HomepageFeatureColumn[]= homepageFeatures.map((item) =>({
        id: item.id,
        title: item.title,
        content: item.content,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <HomepageFeatureClient data={formattedHomepageFeatures}/>
            </div>
        </div>
     );
}
 
export default HomepageFeatures;