const API_BASE_URL = 'http://localhost:8080/api'

export async function getInventory() {
    const response = await fetch(`${API_BASE_URL}/inventory`)

    if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.status}`)
    }

    return response.json()
}