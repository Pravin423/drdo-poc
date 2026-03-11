export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ status: 0, message: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ status: 0, message: 'Village ID is required' });
    }

    try {
        let token = req.headers.authorization;
        if ((!token || token.includes("undefined") || token.includes("null")) && req.cookies?.auth_token) {
            token = `Bearer ${req.cookies.auth_token}`;
        }

        if (!token || token.includes("undefined") || token.includes("null")) {
            return res.status(401).json({ status: 0, message: 'Unauthorized' });
        }

        const externalApiUrl = `https://goadrda.runtime-solutions.net/admin/api/villages/${id}`;

        const response = await fetch(externalApiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        // The DRDA API might return 204 No Content for a successful deletion
        if (response.status === 204 || response.status === 200 || response.status === 201) {
            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                // If it's a 204 or empty response body, json() will throw. We can safely ignore it.
            }
            return res.status(200).json({ status: 1, message: 'Deleted successfully', ...data });
        }

        let errorData = {};
        try {
            errorData = await response.json();
        } catch (e) {
            // Ignore parse errors if response is not JSON
        }

        return res.status(response.status).json({
            status: 0,
            message: errorData.message || errorData.error || `Failed to delete village (HTTP ${response.status})`,
            details: errorData
        });

    } catch (error) {
        console.error("Proxy error:", error);
        return res.status(500).json({ status: 0, message: 'Internal Server Error' });
    }
}
