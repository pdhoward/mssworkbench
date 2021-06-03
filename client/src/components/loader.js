export class Loader {
    cancelToken = null;

    async Load(CancelToken) {
        this.cancelToken = new CancelToken();
        try {
            await this.cancelToken
        } catch (error) {
            if (error.name === 'AbortError') {
                return
            }
            throw(error)
        }
        finally {
            this.cancelToken = null
        }
    }

    Abort() {
        this.cancelToken.abortController.abort();
    }
}

export class CancelToken {
    abortController = new AbortController()

    get Signal() {
        return this.abortController.signal
    }

    get Aborted()  {
        return this.abortController.signal.aborted
    }

   async Fetch(url) {
       console.log(`----------------------------debug Cancel token fetch---------------------`)
       console.log(url)
        try {
            const response = await fetch(url, { signal: this.Signal })
            if (this.Aborted) return null
            try {
                const responseTxt = await response.text()
                try {
                    const body = JSON.parse(responseTxt)
                    if(!body.error && response.status >= 400) {
                        return { error: `fetch from ${url} returned status code ${response.status}, response: ${responseTxt}` }
                    }
                    return body
                } catch (jsonErr) {
                    if (this.Aborted) return null
                    console.warn(`unable to parse response json:`, jsonErr)
                    return { error: `fetch from ${url} returned status code ${response.status}, text: ${responseTxt}`}
                }
            } catch (txtErr) {
                if (this.Aborted) return null
                console.warn(`unable to parse response text:`, txtErr)
                return { error: `fetch from ${url} returned status code ${response.status}`}
            }
        } catch (error) {
            if (this.Aborted) return null
            return { error: `fetch from ${url} errored: ${error}`}
        }
    }
}