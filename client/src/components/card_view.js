import React from "react";
import { useTheme } from './theme_hook';
import ReactJson from 'react-json-view';
import { Url } from "./url";
import { Includes } from "../../shared/search";
import { Search, UseSearch } from "./use_search";

// export interface CardViewProps {
//     raw: any[];
//     url: Url;
// }

export const CardView = (props) => {
    const search= UseSearch(props.url)

    let raw = props.raw
    if (search.pattern) {
        raw = filterJson(props.raw, search)
    }
    const { theme, _ } = useTheme()
    const jsonTheme = theme === `dark` ? `twilight` : undefined
    return (
        <ReactJson src={raw} theme={jsonTheme} style={{padding: 10, border: "solid gray 1px"}} />
    )
}

const filterJson = (obj, search) => {
    if (!obj) {
        return obj
    }
    if (Array.isArray(obj)) {
        return filterArray(obj, search)
    }
    if (typeof obj === 'object') {
        return filterObject(obj, search)
    }
    if (Includes(obj.toString(), search.pattern, search.style)) {
        return obj
    }
    return undefined
}

const filterArray = (obj, search) => {
    const res = []
    for (const item of obj) {
        const filtered = filterJson(item, search)
        if (isEmpty(filtered)) {
            continue
        }
        res.push(filtered)
    }
    return res
}

const filterObject = (obj, search) => {
    const res = {}
    for (const key in obj) {
        if (Includes(key, search.pattern, search.style)) {
            res[key] = obj[key]
            continue
        }
        const filtered  = filterJson(obj[key], search)
        if (isEmpty(filtered)) {
            continue
        }
        res[key] = filtered
    }
    return res
}

const isEmpty = (filtered) => {
    if (!filtered) {
        return true
    }
    if (typeof filtered === 'object' && Object.keys(filtered).length === 0) {
        return true
    }
    return false
}