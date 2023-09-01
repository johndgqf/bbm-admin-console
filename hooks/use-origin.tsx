/*To help access the window object on next13 because the majority of functions in next13 
is server-side rendering and on the server the window object does not exist */

import { useState, useEffect } from "react";

export const useOrigin = () =>{
    const [mounted, setMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        setMounted(true);
    }, []);

    if(!mounted) {
        return "";
    }
    return origin;
};