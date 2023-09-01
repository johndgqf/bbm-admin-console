import prismadb from "@/lib/prismadb";
import { HomepageFeatureForm } from "./components/homepage-feature-form";

const HomepageFeature = async ({
  params,
}: {
  params: { homepageFeatureId: string };
}) => {
  //Fetching the existing data from our homepage features
    //We use findUnique here to decide whether there is a existing feature or not so that we 
    // ... can conditionally call the create new form or an edit form 
  const homepageFeature = await prismadb.homepageFeature.findUnique({
    where: {
      id: params.homepageFeatureId,
    },
  });

  return( 
  
  <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <HomepageFeatureForm initialData={homepageFeature}/>
        </div>

  </div>);
};

export default HomepageFeature;
