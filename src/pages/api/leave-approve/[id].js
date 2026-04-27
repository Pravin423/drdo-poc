export default async function handler(req, res) {
    let authHeader = req.headers["authorization"];
    if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
        authHeader = `Bearer ${req.cookies.auth_token}`;
    }

    if (!authHeader) {
        return res.status(401).json({ status: false, message: "No authorization header" });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ status: false, message: "Leave ID is required" });
    }

    try {
        const response = await fetch(`https://goadrda.runtime-solutions.net/admin/api/leave-approve/${id}`, {
            method: "GET",
            headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error("Leave Approve proxy fetch error:", error);
        return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
    }
}
