import {format} from "date-fns";
import prismadb from "@/lib/prismadb";
import { MapClient } from "./components/client";
import { MapColumn } from "./components/columns";
//In order to use await inside a function you need to use async
const Maps = async ({
    params
}: {
    params: {storeId: string}
}) => {
    // Fetching all map  data to the map page 
    const maps = await prismadb.map.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy:{
            createdAt: 'desc'
        }
    })
    // Now after you have your map fetched, you can start passing all the features to MapClient
    const formattedMaps: MapColumn[]= maps.map((item) =>({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <MapClient data={formattedMaps}/>
            </div>
        </div>
     );
}
 
export default Maps;