import { Url } from "./url";
import { SearchStyle } from "../shared/search";
import { useEffect, useState } from "react";

// export type Search = {
//     pattern: string
//     style: SearchStyle
// }

export function UseSearch(url) {
    function getSearch()  {
        return {
            pattern: url.Get(`search`) || ``,
            style: (url.Get(`search_style`) || ``) 
        }
    }
    const [search, setSearch] = useState(getSearch())
    useEffect(() => {
        function onUrlChanged(_) {
            setSearch(getSearch())
        }
        url.Subscribe(onUrlChanged)
        return function cleanup() {
            url.Unsubscribe(onUrlChanged)
        }
    })
    return search
}