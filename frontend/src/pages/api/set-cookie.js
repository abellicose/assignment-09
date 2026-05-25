export default function handler(req, res) {
    const { token } = req.body;
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${token ? 60 * 60 * 24 * 7 : 0}; Path=/`);
    res.status(200).json({ success: true });
}
