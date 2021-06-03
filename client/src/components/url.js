import qs from 'qs'

//export type UrlProperty = `raw` | `search` | `offset` | `limit` | `from_time` | `to_time` | `search_by` | `search_style`

export class Url {
    obj = ''

    BaseUrl = ''

    subscribers = []

    constructor(location, baseUrl) {
        if (location.startsWith("?")) {
            location = location.substring(1)
        }
        this.obj = qs.parse(location)
        this.BaseUrl = baseUrl
    }

     Get(name) {
        return this.obj[name]?.toString() || undefined
    }

    Set(...props) {
        for (const prop of props) {
            if (prop.val) {
                this.obj[prop.name] = prop.val
            } else {
                delete this.obj[prop.name]
            }
        }
        this.Refresh()
    }

    Subscribe(callback) {
        this.subscribers.push(callback)
    }

    Unsubscribe(callback) {
        const index = this.subscribers.indexOf(callback)
        if (index > -1) {
            this.subscribers.splice(index, 1);
        }
    }

    Refresh() {
        const query = qs.stringify(this.obj)
        const url = query ? `${this.BaseUrl}?${query}` : this.BaseUrl

        //We're using window.history and not the router history because we don't want to navigate away, this is just for sharing url purposes.
        window.history.replaceState(null, document.title, url || "?") //if base url was not set and they are no properties on the url it will be an empty string which seems to be ignored by replaceState so we're defaulting to "?"
        for (const subscriber of this.subscribers) {
            subscriber(url)
        }
    }
}