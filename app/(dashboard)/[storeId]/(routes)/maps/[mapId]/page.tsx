import prismadb from "@/lib/prismadb";
import { MapForm } from "./components/map-form";

const Map = async ({
  params,
}: {
  params: { mapId: string };
}) => {
  //Fetching the existing data from our homepage features
    //We use findUnique here to decide whether there is a existing feature or not so that we 
    // ... can conditionally call the create new form or an edit form 
  const map = await prismadb.map.findUnique({
    where: {
      id: params.mapId,
    },
  });

  return( 
  
  <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <MapForm initialData={map}/>
        </div>

  </div>);
};

export default Map;
