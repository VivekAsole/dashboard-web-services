export default async function fetchAPI(url) {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json()

        return { data, error: null }
    } catch (error) {
        return { data: null, error: error.message }
    }
}
